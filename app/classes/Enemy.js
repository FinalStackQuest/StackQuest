import entityPrefab from './entityPrefab'
import { socket } from '../sockets'

/* global Phaser */

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

  move(path) {
    if (this.body && path) {
      const speed = 100
      const xDirection = this.x - path.x * 60
      const yDirection = this.y - path.y * 60
      const absDirection = Math.abs(xDirection) * 2 - Math.abs(yDirection)
      let newOrientation

      if (yDirection >= 0) {
        this.body.velocity.y = -speed
        if (absDirection < 0) newOrientation = 'walk_up'
      } else if (yDirection < 0) {
        this.body.velocity.y = speed
        if (absDirection < 0) newOrientation = 'walk_down'
      }
      if (xDirection >= 0) {
        this.body.velocity.x = -speed
        if (absDirection > 0) newOrientation = 'walk_left'
      } else if (xDirection < 0) {
        this.body.velocity.x = speed
        if (absDirection > 0) newOrientation = 'walk_right'
      }

      if (newOrientation !== this.orientation) {
        this.orientation = newOrientation
        this.animations.play(this.orientation, 30, true)
      }
    }
    socket.emit('updatePosition', this.name, this.x, this.y)
  }

  attack() {
    if (Date.now() - this.lastAttack < 900) return 0
    this.lastAttack = Date.now()
    return this.stats.attack
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
