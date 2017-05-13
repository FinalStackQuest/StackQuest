import entityPrefab from './entityPrefab'
import { socket } from '../sockets'
import HealthBar from '../states/utils/HealthBar.js'
import enemyProperties from '../properties/enemyProperties'

/* global StackQuest, Phaser */

export default class Enemy extends entityPrefab {
  constructor(game, name, position, spriteKey, stats) {
    super(game, name, position, spriteKey)
    //  Note: need this for allowing enemy to have inout events
    //  may not be necessary for how we set it up with actions, but needed for clicks
    // this.inputEnabled = true

    this.maxLife = stats.hp
    this.orientation = ''
    this.lastAttack = Date.now()
    this.anchor.set(0.25, 0.2)

    this.absorbProperties(enemyProperties[spriteKey])
    this.stats = stats

    this.setAnimationFrames(this)

    this.move = this.move.bind(this)
    this.attack = this.attack.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.die = this.die.bind(this)
    this.attack = this.attack.bind(this)
    this.enemyHealthBar = new HealthBar(game, { x: position.x, y: position.y })
  }

  move(newPos) {
    if (this.body && newPos) {
      const speed = 100
      const xDirection = this.x - newPos.x
      const yDirection = this.y - newPos.y
      const absDirection = Math.abs(xDirection) * 2 - Math.abs(yDirection)
      this.tween = this.game.tweens.create(this)
      let newOrientation

      if (yDirection >= 0) {
        if (absDirection < 0) newOrientation = 'walk_up'
      } else if (yDirection < 0) {
        if (absDirection < 0) newOrientation = 'walk_down'
      }
      if (xDirection >= 0) {
        if (absDirection > 0) newOrientation = 'walk_left'
      } else if (xDirection < 0) {
        if (absDirection > 0) newOrientation = 'walk_right'
      }

      this.tween.to({ x: newPos.x, y: newPos.y }, 33)

      if (newOrientation !== this.orientation) {
        this.orientation = newOrientation
        this.animations.play(this.orientation, 10, true)
      }

      this.tween.start()
    }

    this.enemyHealthBar.setPosition(this.x, this.y)
  }

  attack() {
    if (Date.now() - this.lastAttack > 1000) {
      this.lastAttack = Date.now()
      return this.stats.attack
    } else {
      return 0
    }
  }

  takeDamage(damage) {
    const damageTaken = damage - this.stats.defense
    this.stats.hp -= damageTaken

    const damageText = StackQuest.game.add.text(this.x + Math.random() * 20, this.y + Math.random() * 20, damageTaken, { font: '32px Times New Roman', fill: '#ffa500' })
    setTimeout(() => damageText.destroy(), 500)

    this.computeLifeBar()
    //  check if dead
    if (this.stats.hp <= 0) {
      this.die()
    }
    // return damage
    return damageTaken
  }

  die() {
    //  makes enemies health bar disappear
    this.enemyHealthBar.kill()
    this.target = null
    this.alive = false
    this.delayedKill(500)
  }

  computeLifeBar() {
    if (this.stats.hp < 0) this.stats.hp = 0
    const percent = Math.floor((this.stats.hp / this.maxLife) * 100)
    this.enemyHealthBar.setPercent(percent)
  }
}
