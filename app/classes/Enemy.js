import entityPrefab from './entityPrefab'
import { socket } from '../sockets'
import enemyProperties from '../properties/enemyProperties'

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

    this.orientation = ''
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
    console.log(this.frames)
    this.setAnimationFrames(this)

    this.move = this.move.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.attack = this.attack.bind(this)
  }

  move(path) {
    if (this.body && path[1]) {
      const speed = 100
      const xDirection = this.x - path[1].x * 60
      const yDirection = this.y - path[1].y * 60
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
    this.target = null
    this.alive = false
    this.delayedKill(500)
  }
}
