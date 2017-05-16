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
    return this.player.stats.attack + this.attack
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
