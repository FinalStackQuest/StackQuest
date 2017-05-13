import Prefab from './entityPrefab'
import playerProperties from '../properties/playerProperties'
import { socket } from '../sockets'

/* global Phaser */

// client side class for Playable Characters
export default class Player extends Prefab {
  constructor(game, name, property) {
    super(game, name, { x: property.x, y: property.y }, property.class)
    this.anchor.set(0.5, 0.5)
    this.orientation = 4 // down

    this.maxLife = this.game.playerLife
    this.inFight = false

    this.absorbProperties(playerProperties[property.class])
    this.stats.hp = property.hp
    this.setAnimationFrames(this)

    this.lootCount = 0

    this.loadControls()
    this.loadProjectile()

    this.movePlayer = this.movePlayer.bind(this)
    this.moveOther = this.moveOther.bind(this)
    this.getProjectile = this.getProjectile.bind(this)
  }

  equipWeapon(weaponKey) {
    this.weapon.name = weaponKey
    this.weapon = playerProperties[weaponKey] // assigns stats to weapon
    this.stats.attack = this.weapon.stats.attack + this.stats.attack
    this.setAnimations(this.weapon)
    return true
  }

  equipArmor(armorKey) {
    this.armor.name = armorKey
    this.armor = playerProperties[armorKey]
    this.stats.defense = this.armor.stats.defense + this.stats.defense
    return true
  }

  loadControls() {
    this.cursors = {}
    this.cursors.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.cursors.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.cursors.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    this.cursors.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.cursors.chat = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB)
    this.cursors.click = this.game.input.activePointer
  }

  moveOther(targetX, targetY) {
    const xDirection = this.position.x - targetX
    const yDirection = this.position.y - targetY
    const absDirection = Math.abs(xDirection) * 2 - Math.abs(yDirection)

    if (yDirection > 0) {
      this.orientation = 2
    } else if (yDirection < 0) {
      this.orientation = 4
    }
    if (xDirection > 0) {
      this.orientation = 1
    } else if (xDirection < 0) {
      this.orientation = 3
    }

    this.animations.play(`walk_${this.orientationsDict[this.orientation]}`, null, true)
    if (this.game) {
      this.moveTween = this.game.add.tween(this.position).to({ x: targetX, y: targetY })
      this.moveTween.onComplete.add(this.completeMovement, this)
      this.moveTween.start()
    }
  }

  completeMovement() {
    this.animations.stop()
  }

  movePlayer() {
    this.body.velocity.x = 0
    this.body.velocity.y = 0

    if (this.cursors.up.isDown) {
      this.body.velocity.y = -200
      this.orientation = 2
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount })
    }
    if (this.cursors.down.isDown) {
      this.body.velocity.y = 200
      this.orientation = 4
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount })
    }
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -200
      this.orientation = 1
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount })
    }
    if (this.cursors.right.isDown) {
      this.body.velocity.x = 200
      this.orientation = 3
      socket.emit('updatePlayer', { playerPos: this.position, lootCount: this.lootCount })
    }

    if (this.body.velocity.x + this.body.velocity.y !== 0) {
      this.animations.play(`walk_${this.orientationsDict[this.orientation]}`)
    }
  }

  loadProjectile(type = 'bullet') {
    //  Creates 3 bullets, using the 'bullet' graphic
    this.projectile = this.game.add.weapon(3, type)

    //  The bullet will be automatically killed when it leaves the world bounds
    this.projectile.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    //  The speed at which the bullet is fired
    this.projectile.bulletSpeed = 2000

    //  Speed-up the rate of fire, allowing them to shoot 3 bullet every second
    this.projectile.fireRate = 333

    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    this.projectile.trackSprite(this, 0, 0, false)

    // //  adds damage associated with that player
    this.projectile.damage = this.stats.attack
  }

  getProjectile() {
    return this.projectile
  }
}
