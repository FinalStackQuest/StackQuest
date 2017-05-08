import Prefab from './entityPrefab'

// client side class for Playable Characters
export default class Player extends Prefab {
  constructor(x, y, key) {
    //call it's superclass constructor
    super(x, y, key)
    // Send context as first argument!!
    this.anchor.set(0.25, 0.35)
    this.orientation = 4 // down
    this.speed = this.game.playerSpeed
    // TODO create dialogue logic.. maybe
    // this.dialoguesMemory = {}
    // this.maxLife = this.game.playerLife
    // this.life = this.maxLife
    this.inFight = false
    this.defaultFrames = {
        // the third value is the frame to come back to at the end of the animation
        // TODO reassign frame values based on the sprite.
      'attack_right': [0, 4, 9],
      'right': [5, 8],
      'idle_right': [9, 10],
      'attack_up': [11, 15, 20],
      'up': [16, 19],
      'idle_up': [20, 21],
      'attack_down': [22, 26, 31],
      'down': [27, 30],
      'idle_down': [31, 32],
      'attack_left': [33, 37, 42],
      'left': [38, 41],
      'idle_left': [42, 43]
    }
    // TODO reassign these children based on our assets
    // this.addChild(this.weapon = this.game.add.sprite(0, 0, 'atlas3'))
    // this.addChild(this.shadow = this.game.add.sprite(0, 5, 'atlas1', 'shadow'))
    this.addChild(this.nameHolder = this.game.add.text(0, -30, '', {
      font: '14px pixel',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }))
    this.events.onKilled.add(function(player) {
      this.game.displayedPlayers.delete(player.id)
    }, this)
  }
}
