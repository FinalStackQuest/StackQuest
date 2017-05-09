import entityPrefab from './entityPrefab'

// To Do:
//  1. add correct animations using spritesheet
//  2. resolve 'note' questions
//  3. figure out how this works for all of the different enemies
//  4. resolve Game vs game globals
export default class Enemy extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)
    console.log('game in enemy', this.game)
    //  Note: need this for allowing enemy to have inout events
    //  may not be necessary for how we set it up with actions, but needed for clicks
    this.inputEnabled = true

    //  this.handlBeingAttack

    this.inFight = false
    this.orientation = game.rnd.between(1, 4)
    this.initialPosition = new Phaser.Point(position.x, position.y)

    //  NOTE this is hardcoded until internal stats determined and set on db
    this.stats = {
      hp: 10,
      attack: 10,
      defense: 4,
      speed: 10,
      loot: ['test']
    }
    this.move = this.move.bind(this)
  }

  setup(monsterKey) {
      // key is a string used as a key in Game.monstersInfo to fetch the necessary information about the monster to create
    // it's also used as part of the frame names to use (e.g. rat, red_0, rat_1, ...)
    this.frameName = monsterKey+'_0'
    this.monsterName = monsterKey
    this.anchor.set(0.25, 0.2)
    this.absorbProperties(Game.monstersInfo[monsterKey])
    this.maxLife = this.life
    //  Make sure this adds to Game.entities
    Game.entities.add(this)
    this.setAnimations(this)
    this.idle(false)
  }
  pathfindingCallback(finalOrientation, action, delta, sendToServer, path) {
    // This function is called when the pathfinding algorithm has successfully found a path to navigate
    // finalOrientation is a value between 1 and 4 indicatinh the orientation the player should have at the end of the path
    // action is a small object containing data about what to do once the path is ended (talk to NPC, fight monster, ...)
    // delta is some value based on latency, that will slightly adjust the speed of the movement to compensate for the latency
    // sendToServer is a boolean indicating if the computed path should be sent to the server (because it's the path that the player wants to follow)
    // path is an array of 2-tuples of coordinates
    if (path === null && this.isPlayer) {
      Game.moveTarget.visible = false
      Game.marker.visible = true
    } else if (path !== null){
      if (action.action == 3 || action.action == 4){ // fight or chest
        finalOrientation = Game.computeFinalOrientation(path)
        path.pop() // The player should stop right before the target, not at its location
      }
      var actionToSend = (action.action != 1 ? action : {action:0})
      if (this.isPlayer && sendToServer && path.length) Client.sendPath(path, actionToSend, finalOrientation)
      this.move(path, finalOrientation, action, delta)
    }
  }
  setupMovement(path, action, delta) {
    //  NOTE: Delta is used by Easy Star pathfinding
    if (!path) return
    if (this.tween) {
      //  NOTE: WHAT IS TWEEN IN THIS CONTEXT?
      this.stopMovement(false)
    }
    //  pathFindingCallback needs to be on entityPrefab
    this.pathfindingCallback(0, action, delta, false, path) // false : send to server
  }
  move(path) {
    let count = 0
    // const self = this
    console.log('path', path)
    for (let step of path) {
      console.log('this count ', count)
      // const tween = self.game.add.tween(self.position)
      // tween.to({x: step.x * 60, y: step.y * 60}, 32)
      // tween.start()
      this.position.x = step.x
      this.position.y = step.y
      count++
    }
    console.log(this.position)
    // path.forEach(function(step) {
    //   const tween = this.game.tween(this.position)
    //   .to({x: step.x * 60, y: step.y * 60}, 32)
    //   tween.start()
    // })
  }
  attackPlayer(player) {
    this.inFight = true
    //  NOTE: where the tweens coming from here? What do they do?
    this.fightTween = game.add.tween(this)
    //  NOTE: // Small delay to allow the player to finish his movement, -1 for looping
    this.fightTween.to({}, Phaser.Timer.SECOND, null, false, 150, -1)
    this.fightTween.onStart.add(function() { this.attackAction() }, this)
    this.fightTween.onLoop.add(function() { this.attackAction() }, this)
    this.fightTween.start()
  }
  attackAction() {
    if (Date.now() - this.lastAttack < 900) return
    this.lastAttack = Date.now()
    if (!this.target) return
    if (this.target.isPlayer) return
    let direction = Game.adjacent(this, this.target)
    if (direction > 0) {
      if (this.tween) {
        this.tween.stop()
        this.tween = null
      }
      this.orientation = direction
      //  this.attack is contained in entityPrefab
      this.attack()
    }
  }
  adjacent(a, b) {
    if (!a || !b) return 0
    var Xdiff = a.position.x - b.position.x
    var Ydiff = a.position.y - b.position.y
    if (Xdiff === 1 && Ydiff === 0) {
      return 1
    } else if (Xdiff === 0 && Ydiff === 1) {
      return 2
    } else if (Xdiff === -1 && Ydiff === 0) {
      return 3
    } else if (Xdiff === 0 && Ydiff === -1) {
      return 4
    } else if (Xdiff === 0 && Ydiff === 0) { // The two entities are on the same cell
      return -1
    } else { // The two entities are not on adjacent cells, nor on the same one
      return 0
    }
  }

  attack() {
    if (!this.target) return
    var direction = this.adjacent(this, this.target)
    if (direction > 0) this.orientation = direction
    this.animate('attack_' + this.orientationsDict[this.orientation], false)
    if (this.target.deathmark) {
      setTimeout(function(_target) {
        _target.die(true)
      }, 500, this.target)
    }
    this.idle()
  }

  die() {
    this.endFight()
    this.target = null
    this.alive = false
    this.animate('death', false)
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
  lootDrop() {
    if (!this.alive) {
      console.log(this.stats.loot[0])
    }
  }
}
