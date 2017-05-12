import entityPrefab from './entityPrefab'

export default class Player extends entityPrefab {
  constructor(game, name, position, spriteKey, properties) {
    super(game, name, position, spriteKey)
    this.anchor.set(0.25, 0.35)
    this.orientation = 4 // down
    this.maxLife = this.game.playerLife

    this.stats = {
      attack: 0,
      defense: 0,
      speed: 0,
      weapon: '',
      armor: '',
      hp: 0,
    }

    this.life = this.maxLife
    this.inFight = false
    this.frames = {
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
    // this.addChild(this.weapon = this.this.game.add.sprite(0, 0, 'atlas3'))
    // this.addChild(this.shadow = this.this.game.add.sprite(0, 5, 'atlas1', 'shadow'))
    this.events.onKilled.add(function(player) {
      this.game.displayedPlayers.delete(player.id)
    }, this)
    this.getStats = this.getStats.bind(this)

    this.setStats(spriteKey)
  }
}
