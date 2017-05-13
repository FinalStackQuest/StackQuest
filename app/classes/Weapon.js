require('pixi')
require('p2')
require('phaser')

import weaponProperties from '../properties/weaponProperties'

class Weapon extends Phaser.Weapon {
	constructor (game, player, weaponKey) {
		super(game)

		this.game = game
		this.absorbProperties(weaponProperties[weaponKey])

		this.createBullets(this.quantity, weaponKey, 0)
	  	this.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
	  	this.damage = player.stats.attack + this.attack

	    this.trackSprite(player, 0, 0, false)
	    this.setBulletAnimationFrames()
	    this.bulletAnimation = 'launch'    
	}

	setBulletAnimationFrames() {
		const frames = this.frames
		console.log(this.frames)
		const animationTypes = ['launch', 'collide']

		for (const animationType of animationTypes) {
			if (frames[animationType]) {
				if (animationType === 'collide') {
					this.addBulletAnimation(animationType, frames[animationType], 16, false);
				} else {
					this.addBulletAnimation(animationType, frames[animationType], 16, true);
				}
			}
		}
	}

	absorbProperties(object) {
    	Object.assign(this, object)
  	}
}

export default Weapon