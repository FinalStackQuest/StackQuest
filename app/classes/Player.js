import store from 'APP/app/store'
import { toggleChatBox } from 'APP/app/reducers/chat'

import EntityPrefab from './EntityPrefab'
import HealthBar from './HealthBar.js'
import Weapon from './Weapon'
import HUD from './HUD'
import Game from './Game'

import armorProperties from '../properties/armorProperties.json'
import playerProperties from '../properties/playerProperties.json'
import itemProperties from '../properties/itemProperties.json'

import { socket } from '../sockets'

/* global StackQuest, Phaser */
let playerObj

// client side class for Playable Characters
export default class Player extends EntityPrefab {
  constructor(game, name, player, socketId) {
    super(game, name, { x: player.x, y: player.y }, player.class)

    Game.GameGroups.players.add(this)
    console.log(socketId)
    Game.GamePlayers[socketId] = this
    console.log(Game.GamePlayers, socketId)

    this.socketId = socketId
    this.player = player
    this.lastAttackerId = null

    this.anchor.set(0.5, 0.2)
    this.orientation = 'down'

    this.lastSpecialAttack = Date.now()

    this.absorbProperties(playerProperties[player.class])

    this.checkStats(player)

    this.stats.hp = player.hp
    this.setAnimationFrames(this)
    this.killCount = player.killCount || 0
    this.lootCount = player.lootCount || 0
    this.pvpCount = player.pvpCount || 0

    this.loadControls = this.loadControls.bind(this)
    this.loadControls()
    this.chatToggleTime = Date.now()

    this.movePlayer = this.movePlayer.bind(this)
    this.moveOther = this.moveOther.bind(this)

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

  checkStats(player) {
    if (player.stats) this.stats = player.stats
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

  chat() {
    if (this.cursors.chat.isDown) {
      if (Date.now() - this.chatToggleTime > 150) {
        store.dispatch(toggleChatBox())
        this.chatToggleTime = Date.now()
      }
      if (store.getState().chat.showChat) {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.W)
        this.game.input.keyboard.removeKey(Phaser.Keyboard.S)
        this.game.input.keyboard.removeKey(Phaser.Keyboard.D)
        this.game.input.keyboard.removeKey(Phaser.Keyboard.A)
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
        this.game.input.keyboard.removeKey(Phaser.Keyboard.B)
      } else {
        this.loadControls()
      }
    }
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
      this.moveTween = this.game.add.tween(this.position).to({ x: targetX, y: targetY }, 33)
      this.moveTween.onComplete.add(this.completeMovement, this)
      this.moveTween.start()
    }
    this.playerHealthBar.setPosition(targetX, targetY - 10)
  }

  completeMovement() {
    this.animations.stop()
  }

  takeDamage(damage, enemySocketId) {
    if (enemySocketId) {
      this.lastAttackerId = enemySocketId
    }

    const damageTaken = damage - (this.stats.defense + this.armor.defense)
    if (damageTaken > 0) {
      this.stats.hp -= damageTaken
      const damageText = StackQuest.game.add.text(this.x + Math.random() * 20, this.y + Math.random() * 20, damageTaken, { font: '20px Press Start 2P', fill: '#ffa500' })
      setTimeout(() => damageText.destroy(), 500)

      if (this.HUD) {
        this.HUD.updateHealth()
        this.game.plugins.screenShake.shake(3, this)
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

    if (this.lastAttackerId) {
      socket.emit('killPlayer', this.lastAttackerId)
    }

    // Revive
    setTimeout(() => {
      this.recoverHp()
      this.savePlayer()
    }, 100)
    socket.emit('updatePlayer', { playerPos: this.position, lootCount: 0, killCount: this.killCount, pvpCount: this.pvpCount })

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
    socket.emit('updateStats', this.stats)
  }

  movePlayer() {
    this.body.velocity.x = 0
    this.body.velocity.y = 0

    this.playerHealthBar.setPosition(this.position.x, this.position.y - 10)

    if (this.cursors.up.isDown) {
      this.body.velocity.y = -this.stats.speed
      this.orientation = 'up'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount, pvpCount: this.pvpCount })
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = this.stats.speed
      this.orientation = 'down'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount, pvpCount: this.pvpCount })
    }
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.stats.speed
      this.orientation = 'left'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount, pvpCount: this.pvpCount })
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.stats.speed
      this.orientation = 'right'
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount, pvpCount: this.pvpCount })
    }

    if (this.body.velocity.x + this.body.velocity.y !== 0) {
      console.log(Game.GamePlayers)
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

    case 'hp':
      this.stats.hp += itemProperty.buff
      if (this.stats.hp > 100) this.stats.hp = 100
      break
    }

    if (this.HUD) {
      let text = `Acquired ${item}`

      if (itemProperty.type === 'attack' || itemProperty.type === 'defense') {
        this.HUD.updateStats()
        text += `, ${itemProperty.type}+${itemProperty.buff} `
      } else if (itemProperty.type === 'hp') {
        this.computeLifeBar()
        this.HUD.updateHealth()
        text += `, ${itemProperty.type}+${itemProperty.buff} `
      } else if (itemProperty.type === 'loot') {
        this.HUD.updateCount()
      }

      this.HUD.updateFeed(text)
    }

    socket.emit('updateStats', this.stats)
    socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount, killCount: this.killCount, pvpCount: this.pvpCount })
  }

  savePlayer() {
    this.player.x = this.x
    this.player.y = this.y
    this.player.hp = this.stats.hp
    this.player.killCount = this.killCount
    this.player.lootCount = this.lootCount
    this.player.pvpCount = this.pvpCount

    socket.emit('savePlayer', this.player)
  }

  toggleHUDBoards() {
    if (this.HUD && this.cursors.board.isDown) {
      this.HUD.toggleBoards()
    }
  }

}
