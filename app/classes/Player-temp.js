import Prefab from './entityPrefab'
import playerProperties from '../properties/playerProperties'
import {socket} from '../sockets'
// client side class for Playable Characters
export default class Player extends Prefab {
  constructor(game, name, property) {
    super(game, name, {x: property.x, y: property.y}, property.class)

    this.anchor.set(0.5, 0.5)
    this.orientation = 4 // down

    this.maxLife = this.game.playerLife
    this.inFight = false

    this.absorbProperties(playerProperties[property.class])
    this.stats.hp = property.hp
    this.setAnimationFrames(this)

    this.loadControls()
    this.movePlayer = this.movePlayer.bind(this)
    this.moveOther = this.moveOther.bind(this)
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
    this.moveTween = this.game.add.tween(this.position).to({x: targetX, y: targetY})
    this.moveTween.onComplete.add(this.completeMovement, this)
    this.moveTween.start()
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
      socket.emit('updatePlayer', this.position)
    }
    if (this.cursors.down.isDown) {
      this.body.velocity.y = 200
      this.orientation = 4
      socket.emit('updatePlayer', this.position)
    }
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -200
      this.orientation = 1
      socket.emit('updatePlayer', this.position)
    }
    if (this.cursors.right.isDown) {
      this.body.velocity.x = 200
      this.orientation = 3
      socket.emit('updatePlayer', this.position)
    }

    if (this.body.velocity.x + this.body.velocity.y !== 0) {
      this.animations.play(`walk_${this.orientationsDict[this.orientation]}`) 
    }
  }
}
