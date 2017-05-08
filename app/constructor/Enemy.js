import entityPrefab from '../states/entityPrefab'


// To Do:
//  1. add correct animations using spritesheet
//  2. resolve 'note' questions
//  3. figure out how this works for all of the different enemies
//  4. resolve Game vs game globals
export default class Enemy extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)
    this.inputEnabled = true
    this.events.onInputUp.add(Game.handleMonsterClick, this)
    this.inFight = false
    this.orientation = game.rnd.between(1, 4)
    this.initialPosition = new Phaser.Point(position.x, position.y)

    //  NOTE this is hardcoded until internal stats determined
    this.stats = {
      hp: 10,
      attack: 10,
      defense: 4,
      speed: 10,
    }
  }

  setup(monsterKey) {
      // key is a string use as a key in Game.monstersInfo to fetch the necessary information about the monster to create
    // it's also used as part of the frame names to use (e.g. rat, red_0, rat_1, ...)
    this.frameName = monsterKey+'_0'
    this.monsterName = monsterKey
    this.anchor.set(0.25, 0.2)
    this.absorbProperties(Game.monstersInfo[monsterKey])
    if (this.customAnchor) {
      this.anchor.x = this.customAnchor.x
      this.anchor.y = this.customAnchor.y
    }
    this.maxLife = this.life
    Game.entities.add(this)
    this.setAnimations(this)
    this.idle(false)
  }
  setupMovement(path, action, delta) {
    //  NOTE: WHAT IS DELTA IN PHASER QUEST?
    if (!path) return
    if (this.tween) {
      //  NOTE: WHAT IS TWEEN IN THIS CONTEXT?
      this.stopMovement(false)
      //  path[0] = this.adjustStartPosition(path[0])
    }
    this.pathfindingCallback(0, action, delta, false, path) // false : send to server
  }
  attackPlayer(player) {
    this.inFight = true
    //  NOTE: where the tweens coming from here? What do they do?
    this.fightTween = game.add.tween(this)
    //  NOTE: // Small delay to allow the player to finish his movement, -1 for looping
    this.fightTween.to({}, Phaser.Timer.SECOND, null, false, 150, -1)
    this.fightTween.onStart.add(function() { this.fightAction() }, this)
    this.fightTween.onLoop.add(function() { this.fightAction() }, this)
    this.fightTween.start()
  }
  attackAction() {
    if (Date.now() - this.lastAttack < 900) return
    this.lastAttack = Date.now()
    if (!this.target) return
    if (this.target.isPlayer) return
    var direction = Game.adjacent(this, this.target)
    if (direction > 0) {
      if (this.tween) {
        this.tween.stop()
        this.tween = null
      }
      this.orientation = direction
      this.attack()
    }
  }
  die() {
    this.endFight()
    this.target = null
    this.alive = false
    if (animate) {
      this.animate('death', false)
    }
    this.delayedKill(500)
  }
  respawn() {
    //  method from the Phaser Sprite class
    this.revive()
    this.orientation = game.rnd.between(1, 4)
    this.position.set(this.initialPosition.x, this.initialPosition.y)
    this.life = this.maxLife
    this.idle(true)
    Game.fadeInTween(this)
  }
}
