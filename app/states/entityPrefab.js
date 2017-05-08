/* USE
- all characters should extend from entityPrefab constructor
- all characters will share qualities defined in entityPrefab
*/

/* todo
- define collision here?
*/
// todo: weapon prefab
// todo: health bar
// todo: activity feed
// todo: set death property on living entity
// todo; displayHP function that shows numeric value upon hp change, different color for heal and damage

export default class entityPrefab extends Phaser.Sprite {
  constructor(game, name, position, spriteKey) {
    /* property considerations:
      sprite - player class, monster npc type, friendly npc type,
      group - necessary?,
    */

    /* frames considerations:
      at higher level class that extends from prefab should have a this.frames property
      which is an object that stores multiple key value pairs where the key is animation type and value represents the frames array
      frames object - {'animationTypeOne': [frames], 'animationTypeTwo': [frames]}
    */

    super(game, position.x, position.y, spriteKey)

    // this.gameState = game
    // may not need this
    this.name = name
    this.attackTarget = null

    game.add.existing(this)
    // adds current prefab to the gameState
    game.physics.p2.enable(this)

    game.prefabs[name] = this
    // need this?
    // gameState has prefabs object that allows access to current prefab sprite?
  }

  // phaser quest approach
  setAnimationFrames() {
    // add animations for 'idle' move' 'death' 'attack' to the sprite object entity
    // if playable character, the animation should be set to weapon as well
    const frames = this.frames
    // let deathFrames
    // if (frames.hasOwnProperty('death')) {
    //   deathFrames = Phaser.Animations.generateFrameNames(`${this.name}-death`, frames[death][0], frames[death][1])
    // } else {
    //    deathFrames = Phaser.Animations.generateFramesNames('death', 0, 5)
    // }
    // this.animations.add('death', deathFrames)
    // - can be used if some characters have different death animations

    this.animations.add('death', /* some default death frames */null, 8, false) // last argument is a toggle for looping the animation
    // assumes that death animation is same for all characters
    // generateFrameNames(spritesheetKey, startingFrame, lastFrame, suffix)
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
        const animationType = `${animationPrefix}-${direction}`

        if (frames.hasOwnProperty(animationType)) {
          this.animations.add(animationType, frames[animationType], rates[animationPrefix], false)
          // do we auto attack targetted monsters/players?
        }
        // every character json or db information has a
      }
    }
  }
}
