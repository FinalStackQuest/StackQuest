import entityPrefab from './entityPrefab'
import { socket } from '../sockets'

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

    // this.inFight = false
    // this.orientation = game.rnd.between(1, 4)
    this.orientation = ''
    // this.initialPosition = new Phaser.Point(position.x, position.y)
    this.lastAttack = Date.now()
    this.anchor.set(0.25, 0.2)
    //  NOTE this is hardcoded until internal stats determined and set on db
    this.stats = {
      hp: 30,
      attack: 10,
      defense: 4,
      speed: 10,
      loot: ['test']
    }

    this.animations.add('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8])
    this.animations.add('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17])
    this.animations.add('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26])
    this.animations.add('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35])

    this.move = this.move.bind(this)
    this.attack = this.attack.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.die = this.die.bind(this)
    // this.attackPlayer = this.attackPlayer.bind(this)
    // this.attackAction = this.attackAction.bind(this)
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
  }

  attack() {
    if (Date.now() - this.lastAttack > 1000) {
      this.lastAttack = Date.now()
      const damage = StackQuest.game.add.text(this.x, this.y + 20, '-' + this.stats.attack, { font: '22px Times New Roman', fill: '#ff0000' })
      setTimeout(() => { damage.destroy() }, 3000)
      return this.stats.attack
    } else {
      return 0
    }
  }

  takeDamage(damage) {
    this.stats.hp -= (damage - this.stats.defense)
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
    // this.endFight()
    this.target = null
    this.alive = false
    // this.animate('death', false)
    this.delayedKill(500)
  }
}
