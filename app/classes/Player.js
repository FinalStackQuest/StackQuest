import EntityPrefab from './EntityPrefab'
import HealthBar from './HealthBar.js'
import Weapon from './Weapon'
import HUD from './HUD'

import armorProperties from '../properties/armorProperties.json'
import playerProperties from '../properties/playerProperties.json'
import itemProperties from '../properties/itemProperties.json'

import { socket, GameGroups } from '../sockets'

/* global StackQuest, Phaser */

// client side class for Playable Characters
export default class Player extends EntityPrefab {
  constructor(game, name, player) {
    super(game, name, { x: player.x, y: player.y }, player.class)

    GameGroups.players.add(this)

    this.player = player
    this.anchor.set(0.5, 0.2)
    this.orientation = 'down'

    this.lastSpecialAttack = Date.now()

    this.absorbProperties(playerProperties[player.class])

    this.stats.hp = player.hp
    this.setAnimationFrames(this)
    this.killCount = 0
    this.lootCount = 0
    this.loadControls()

    this.movePlayer = this.movePlayer.bind(this)
    this.moveOther = this.moveOther.bind(this)

    this.bulletPool = this.game.add.group()

    this.equipSpecial = this.equipSpecial.bind(this)
    this.equipSpecial(this.specialKey)
    this.specialAttack = this.specialAttack.bind(this)

    this.equipWeapon = this.equipWeapon.bind(this)
    this.equipWeapon(this.weaponKey)
    this.attack = this.attack.bind(this)

    this.equipArmor = this.equipArmor.bind(this)
    this.equipArmor(this.armorKey)

    this.takeDamage = this.takeDamage.bind(this)
    this.respawn = this.respawn.bind(this)
    this.playerHealthBar = new HealthBar(game, { x: player.x, y: player.y - 10 })
    this.computeLifeBar()
    this.recoverHp = this.recoverHp.bind(this)

    this.pickUpItem = this.pickUpItem.bind(this)
    this.savePlayer = this.savePlayer.bind(this)
  }

  equipSpecial(specialKey) {
    this.special = new Weapon(this.game, this, specialKey)
    this.special.name = specialKey
    return true
  }
  equipWeapon(weaponKey) {
    this.weapon = new Weapon(this.game, this, weaponKey)
    this.weapon.name = weaponKey
    return true
  }

  equipArmor(armorKey) {
    this.armor = armorProperties[armorKey]
    this.armor.name = armorKey
    return true
  }

  loadControls() {
    this.cursors = {}
    this.cursors.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.cursors.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.cursors.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    this.cursors.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.cursors.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.cursors.chat = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB)
    this.cursors.board = this.game.input.keyboard.addKey(Phaser.Keyboard.B)
    this.cursors.click = this.game.input.activePointer

    this.cursors.board.onDown.add(this.toggleHUDBoards, this)
  }

  moveOther(targetX, targetY) {
    const xDirection = this.position.x - targetX
    const yDirection = this.position.y - targetY
    const absDirection = Math.abs(xDirection) * 2 - Math.abs(yDirection)

    if (yDirection > 0) {
      this.orientation = 'up'
    } else if (yDirection < 0) {
      this.orientation = 'down'
    }
    if (xDirection > 0) {
      this.orientation = 'left'
    } else if (xDirection < 0) {
      this.orientation = 'right'
    }

    this.animations.play(`walk_${this.orientation}`, null, true)
    if (this.game) {
      this.moveTween = this.game.add.tween(this.position).to({ x: targetX, y: targetY })
      this.moveTween.onComplete.add(this.completeMovement, this)
      this.moveTween.start()
    }
    this.playerHealthBar.setPosition(targetX, targetY - 10)
  }

  completeMovement() {
    this.animations.stop()
  }

  takeDamage(damage) {
    const damageTaken = damage - (this.stats.defense + this.armor.defense)
    if (damageTaken > 0) {
      this.stats.hp -= damageTaken
      const damageText = StackQuest.game.add.text(this.x + Math.random() * 20, this.y + Math.random() * 20, damageTaken, { font: '20px Press Start 2P', fill: '#ffa500' })
      setTimeout(() => damageText.destroy(), 500)

      if (this.HUD) {
        this.HUD.updateHealth()
      }

      socket.emit('updateStats', this.stats)

      this.computeLifeBar()
      //  check if dead
      if (this.stats.hp <= 0) this.respawn()
    }
  }

  respawn() {
    //  make them move to set location
    this.position.x = 500
    this.position.y = 500

    // Revive
    setTimeout(() => {
      this.recoverHp()
      this.savePlayer()
    }, 100)
    socket.emit('updatePlayer', { playerPos: this.position, lootCount: 0, killCount: this.killCount })

    if (this.HUD) {
      this.HUD.updateFeed('You Died')
    }
  }

  recoverHp() {
    this.stats.hp = this.stats.maxHp
    if (this.HUD) {
      this.HUD.updateHealth()
    }
    this.computeLifeBar()
  }

  movePlayer() {
    this.body.velocity.x = 0
    this.body.velocity.y = 0

    this.playerHealthBar.setPosition(this.position.x, this.position.y - 10)

    if (this.cursors.up.isDown) {
      this.body.velocity.y = -this.stats.speed
      this.orientation = 'up'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount })
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = this.stats.speed
      this.orientation = 'down'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount })
    }
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.stats.speed
      this.orientation = 'left'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount })
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.stats.speed
      this.orientation = 'right'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount })
    }

    if (this.body.velocity.x + this.body.velocity.y !== 0) {
      this.animations.play(`walk_${this.orientation}`)
    }
  }
  specialAttack() {
    if (this.cursors.space.isDown && this.cursors.click.isDown) {
      if (Date.now() - this.lastSpecialAttack > 5000) {
        this.lastSpecialAttack = Date.now()
        const targetX = this.game.input.worldX
        const targetY = this.game.input.worldY
        this.special.fire(null, targetX, targetY)
        socket.emit('fireSpecial', targetX, targetY)
      }
    }
  }
  attack() {
    if (this.cursors.click.isDown && !this.cursors.space.isDown) {
      const targetX = this.game.input.worldX
      const targetY = this.game.input.worldY
      this.weapon.fire(null, targetX, targetY)
      socket.emit('fireProjectile', targetX, targetY)
    }
  }

  computeLifeBar() {
    if (this.stats.hp < 0) this.stats.hp = 0
    const percent = Math.floor((this.stats.hp / this.stats.maxHp) * 100)
    this.playerHealthBar.setPercent(percent)
  }

  pickUpItem(item) {
    const itemProperty = itemProperties[item]

    switch (itemProperty.type) {
    case 'attack':
      this.stats.attack += itemProperty.buff
      break

    case 'defense':
      this.stats.defense += itemProperty.buff
      break

    case 'loot':
      this.lootCount += itemProperty.buff
      break
    }

    if (this.HUD) {
      let text = `Acquired ${item}`

      if (itemProperty.type === 'attack' || itemProperty.type === 'defense') {
        this.HUD.updateStats()
        text += `, ${itemProperty.type}+${itemProperty.buff} `
      }

      this.HUD.updateFeed(text)
    }

    socket.emit('updateStats', this.stats)
    socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount })
  }

  savePlayer() {
    this.player.x = this.x
    this.player.y = this.y
    this.player.hp = this.stats.hp

    socket.emit('savePlayer', this.player)
  }

  toggleHUDBoards() {
    if (this.HUD && this.cursors.board.isDown) {
      this.HUD.toggleBoards()
    }
  }

  update() {
    if (this.HUD) {
      this.HUD.updateScoreboard()
      this.HUD.updateKillboard()
    }
  }
}
