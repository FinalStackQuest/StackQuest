// USE
// Top level of character hierarchy
// all characters will share properties and methods defined in entityPrefab
require('pixi')
require('p2')
require('phaser')

/* global Phaser */

export default class entityPrefab extends Phaser.Sprite {
  constructor(game, name, position, spriteKey) {
    super(game, position.x, position.y, spriteKey)
    this.game = game
    this.name = name
    this.anchor.setTo(0.5)
    this.attackTarget = null
    this.nameHolder = game.add.text(0, 60, `${name}`, {
      font: '12px Press Start 2P',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    })
    this.nameHolder.anchor.set(0.5)
    this.addChild(this.nameHolder)
    game.add.existing(this)
    game.physics.arcade.enable(this)

    this.orientationsDict = {
      1: 'left',
      2: 'up',
      3: 'right',
      4: 'down'
    }
  }

  setAnimationFrames(targetObject) {
    const frames = targetObject.frames
    const rates = {
      'idle': 2,
      'walk': 16,
      'attack': 14
    }
    const animationPrefixes = ['idle', 'walk', 'attack']
    const directions = ['up', 'down', 'left', 'right']

    for (const animationPrefix of animationPrefixes) {
      for (const direction of directions) {
        const animationType = `${animationPrefix}_${direction}`

        if (frames.hasOwnProperty(animationType)) {
          targetObject.animations.add(animationType, frames[animationType], rates[animationPrefix], false)
        }
      }
    }
  }

  // Start idling animation, in the appropriate orientation
  idle(force) {
    // force is a boolean to indicate if the animation should be forced to play, or if it can depend from the situation (see animate() )
    this.animate('idle_' + this.orientation, force)
  }

  stopMovement(complete) {
    // complete is a boolean indicating if the onComplete callback should be called
    this.tween.stop(complete)
    this.tween = null
  }

  delayedDeath(delay) {
    setTimeout(function(character) {
      character.die()
    }, delay, this)
  }

  delayedKill(delay) {
    setTimeout(function(character) {
      character.kill()
    }, delay, this)
  }

  absorbProperties(object) {
    Object.assign(this, object)
  }
}
