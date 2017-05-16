require('pixi')
require('p2')
require('phaser')

/* global Phaser */

import weaponProperties from '../properties/weaponProperties.json'

class Weapon extends Phaser.Weapon {
  constructor(game, player, weaponKey) {
    super(game)

    this.game = game
    this.player = player
    this.absorbProperties(weaponProperties[weaponKey])

    this.createBullets(this.quantity, weaponKey, 0)
    this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    this.trackSprite(player, 0, 0, false)
    this.setBulletAnimationFrames()
    this.bulletAnimation = 'launch'
    this.damage = this.damage.bind(this)
    this.bulletSpeedVariance = 50
  }

  damage() {
    const totalAttack = this.player.stats.attack + this.attack
    // variation in damage
    const variation = 0.1
    const damageVariation = Math.floor(Math.random() * (totalAttack * variation))
    const totalDamage = totalAttack + (Math.random() < 0.5 ? damageVariation : -damageVariation)
    return totalDamage
  }

  setBulletAnimationFrames() {
    const frames = this.frames
    const animationTypes = ['launch', 'collide']

    for (const animationType of animationTypes) {
      if (frames[animationType]) {
        if (animationType === 'collide') {
          this.addBulletAnimation(animationType, frames[animationType], 16, false)
        } else {
          this.addBulletAnimation(animationType, frames[animationType], frames.rate, true)
        }
      }
    }
  }

  absorbProperties(object) {
    Object.assign(this, object)
  }
}

export default Weapon
