import Prefab from '../states/entityPrefab'

export default class Player extends Prefab {
  constructor(game, position, properties) {
    super(game, position)

    this.stats = {
      totalAttack: properties.stats.attack + properties.stats.weapon.damage,
      Hp: properties.stats.hp,
      totalDefense: properties.stats.defense + properties.stats.armor.block,
      speed: properties.stats.speed,
      weapon: properties.stats.weapon,
      armor: properties.stats.armor
    }
    this.loadControls()
    this.loadAnimations(properties.animationFrames)
  }
  loadAnimations(frames) {
    // TODO: fill in frame arrays with correct indices
    this.animations.add('right', frames.right, 5, true)
    this.animations.add('left', frames.left, 5, true)
    this.animations.add('up', frames.up, 5, true)
    this.animations.add('down', frames.down, 5, true)
    this.animations.add('attack', frames.attack, 5, false)
  }
  loadControls() {
    this.cursors = {}
    this.cursors.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.cursors.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.cursors.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    this.cursors.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.cursors.attack = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.cursors.chat = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB)
  }
  changeEquip(type, newEquip) {
    this.stats[type] = newEquip
  }
  takeDamage(attack) {
    this.hp -= attack - this.totalDefense
    if (this.hp <= 0) {
      this.destroy()
    }
  }
  inflictDamage() {
    return this.stats.totalAttack
  }
  // play animations
  update() {
    // so it doesn't float off into space...
    this.body.setZeroVelocity()
    if (this.cursors.up.isDown) {
      this.animations.play('up')
      this.body.moveUp(200)
    }
    if (this.cursors.down.isDown) {
      this.animations.play('down')
      this.body.moveDown(200)
    }
    if (this.cursors.left.isDown) {
      this.animations.play('left')
      this.body.moveLeft(200)
    }
    if (this.cursors.up.isDown) {
      this.animations.play('right')
      this.body.moveRight(200)
    }
    if (this.cursors.attack.isDown) {
      this.animations.play('attack')
      this.inflictDamage()
    }
  }
}
