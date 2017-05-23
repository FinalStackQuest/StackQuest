import EntityPrefab from './EntityPrefab'
import HealthBar from './HealthBar.js'
import { socket } from '../sockets'
import enemyProperties from '../properties/enemyProperties.json'
import Loot from 'APP/app/classes/Loot'
import Game from './Game'

/* global StackQuest, Phaser */

export default class Enemy extends EntityPrefab {
  constructor(game, name, position, spriteKey, stats) {
    super(game, name, position, spriteKey)

    Game.groups.enemies.add(this)
    Game.enemies[name] = this

    this.orientation = ''
    this.lastAttack = Date.now()
    this.anchor.set(0.5, 0.2)

    this.absorbProperties(enemyProperties[spriteKey])
    this.stats.hp = stats.hp

    this.setAnimationFrames(this)

    this.move = this.move.bind(this)
    this.attack = this.attack.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.die = this.die.bind(this)
    this.attack = this.attack.bind(this)
    this.dropLoot = this.dropLoot.bind(this)
    this.enemyHealthBar = new HealthBar(game, { x: position.x, y: position.y - 10 })
    this.computeLifeBar()
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

    this.enemyHealthBar.setPosition(this.x, this.y - 10)
  }

  attack() {
    if (Date.now() - this.lastAttack > 1000) {
      this.lastAttack = Date.now()
      // variation in damage
      const variation = 0.1
      const damageVariation = Math.floor(Math.random() * (this.stats.attack * variation))
      const totalDamage = this.stats.attack + (Math.random() < 0.5 ? damageVariation : -damageVariation)
      return totalDamage
    }
  }

  takeDamage(damage) {
    const damageTaken = damage - this.stats.defense
    if (damageTaken > 0) {
      this.stats.hp -= damageTaken
      const damageText = StackQuest.game.add.text(this.x + Math.random() * 20, this.y + Math.random() * 20, damageTaken, { font: '20px Press Start 2P', fill: '#ffa500' })
      setTimeout(() => damageText.destroy(), 500)

      socket.emit('hitEnemy', this.name, damageTaken)

      this.computeLifeBar()
      //  check if dead
      if (this.stats.hp <= 0) this.die()
    }
  }

  loseHealth(damageTaken) {
    this.stats.hp -= damageTaken
    const damageText = StackQuest.game.add.text(this.x + Math.random() * 20, this.y + Math.random() * 20, damageTaken, { font: '20px Press Start 2P', fill: '#ffa500' })
    setTimeout(() => damageText.destroy(), 500)

    this.computeLifeBar()
  }

  die() {
    //  makes enemies health bar disappear
    this.enemyHealthBar.kill()
    this.target = null
    this.alive = false
    this.delayedKill(500)
    this.dropLoot()
  }

  computeLifeBar() {
    if (this.stats.hp < 0) this.stats.hp = 0
    const percent = Math.floor((this.stats.hp / this.stats.maxhp) * 100)
    this.enemyHealthBar.setPercent(percent)
  }

  dropLoot() {
    const chance = Math.floor(Math.random() * 100)
    if (chance < 40) {
      const newItemName = Math.random().toString(36).substr(2, 5) // need this in order to create a random item name
      const itemTypes = ['weapon', 'armor', 'loot', 'health']
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)]
      Game.items[newItemName] = new Loot(StackQuest.game, itemType, { x: this.x, y: this.y }, itemType)
      const newItem = Game.items[newItemName]
      socket.emit('createItem', { name: newItem.name, position: newItem.position, key: newItem.key })
    }
  }
}
