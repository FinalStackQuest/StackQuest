import entityPrefab from './entityPrefab'
import { socket } from '../sockets'
import HealthBar from '../states/utils/HealthBar.js'
import enemyProperties from '../properties/enemyProperties'

/* global StackQuest, Phaser */

// To Do:
//  1. add correct animations using spritesheet
//  2. resolve 'note' questions
//  3. figure out how this works for all of the different enemies
//  4. resolve Game vs game globals
export default class Enemy extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)
    //  Note: need this for allowing enemy to have inout events
    //  may not be necessary for how we set it up with actions, but needed for clicks
    // this.inputEnabled = true
    //  this.handlBeingAttack

    //  hardcoded for now
    this.maxLife = 30
    this.orientation = ''
    // this.initialPosition = new Phaser.Point(position.x, position.y)
    this.lastAttack = Date.now()
    this.anchor.set(0.25, 0.2)
    //  NOTE this is hardcoded until internal stats determined and set on db
    this.absorbProperties(enemyProperties[spriteKey])
    this.stats = {
      hp: 30,
      attack: 10,
      defense: 4,
      speed: 10,
      loot: ['test']
    }

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
    socket.emit('updatePosition', this.name, this.x, this.y)
  }

  attack() {
    if (Date.now() - this.lastAttack > 1000) {
      this.lastAttack = Date.now()
      const damage = StackQuest.game.add.text(this.x + Math.random() * 20, this.y + Math.random() * 20, '-' + this.stats.attack, { font: '32px Times New Roman', fill: '#ff0000' })
      setTimeout(() => damage.destroy(), 500)
      return this.stats.attack
    } else {
      return 0
    }
  }

  takeDamage(damage) {
    this.stats.hp -= (damage - this.stats.defense)
    this.computeLifeBar()
    //  check if dead
    if (this.stats.hp <= 0) {
      this.die()
      //  function returns true if the enemy is dead
      return true
    }
    //  returns false because the enemy didn't die
    return false
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
