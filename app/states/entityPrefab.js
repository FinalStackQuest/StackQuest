// USE
// Top level of character hierarchy
// all characters will share properties and methods defined in entityPrefab

export default class entityPrefab extends Phaser.Sprite {
  constructor(game, name, position, spriteKey) {
    super(game, position.x, position.y, spriteKey)
    this.name = name
    this.attackTarget = null

    this.addChild(this.nameHolder = game.add.text(0, -30, `${name}`, {
      font: '14px pixel',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }))

    game.add.existing(this)
    game.physics.p2.enable(this)
  }

  setAnimationFrames(targetObject) {
    const frames = targetObject.frames
    // this.animations.add('death', [0, 1, 2, 3, 4, 5], 8, false)
    // commented for now
    const rates = {
      'idle': 2,
      'move': 16,
      'attack': 14
    }
    // defines frame rate of each animation type
    const animationPrefixes = ['idle', 'move', 'attack']
    const directions = ['up', 'down', 'left', 'right']

    for (const animationPrefix of animationPrefixes) {
      for (const direction of directions) {
        const animationType = `${animationPrefix}_${direction}`

        if (frames.hasOwnProperty(animationType)) {
          this.animations.add(animationType, frames[animationType], rates[animationPrefix], false)
        }
      }
    }
  }

  absorbProperties(jsonObject) {
    Object.assign(this, jsonObject)
  }
}
