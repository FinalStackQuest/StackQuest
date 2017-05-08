import Prefab from './entityPrefab'

// client side class for Playable Characters
export default class Player extends Prefab {
  constructor(x, y, key) {
    // call it's superclass constructor
    super(x, y, key)
    // Send context as first argument!!
    this.anchor.set(0.25, 0.35)
    this.orientation = 4 // down
    this.speed = this.game.playerSpeed
    // TODO create dialogue logic.. maybe
    // this.dialoguesMemory = {}
    this.maxLife = this.game.playerLife
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
  }
  // changes color of name text if Player is the main Player
  setIsPlayer(flag) {
    this.isPlayer = flag
    if (this.isPlayer) this.nameHolder.addColor('#f4d442', 0)
  }
  // sets the player's name
  setName(name) {
    this.nameHolder.text = name
    this.nameHolder.x = Math.floor(16 - (this.nameHolder.width/2))
  }

  // TODO refactor this to use cursor keys (since we won't be using clicks for movement)
  prepareMovement(end, finalOrientation, action, delta, sendToServer) {
    if (!this.alive || !end) return
    let start = Game.computeTileCoords(this.x, this.y)
    if (start.x === end.x && start.y === end.y) {
      if (action.action === 1) this.finishMovement(finalOrientation, action)
      return
    }
    if (this.isPlayer) Game.manageMoveTarget(end.x,end.y)
    if (this.tween) {
      this.stopMovement(false)
      start = this.adjustStartPosition(start)
    }
    if (this.isPlayer && this.inFight && action.action != 3) this.endFight()
    Game.easystar.findPath(start.x, start.y, end.x, end.y, this.pathfindingCallback.bind(this, finalOrientation, action, delta, sendToServer))
    Game.easystar.calculate()
  }

  equipWeapon(key) {
    this.weapon.name = key
    this.weapon.frameName = key + '_0' // sets initial weapon animation frame
    this.weapon.absorbProperties(Game.itemsInfo[key]) // assigns stats to weapon
    this.atk = this.weapon.attack
    this.adjustWeapon() // will change weapons position on char sprite
    this.setAnimations(this.weapon)
    if (this.isPlayer) {
      Game.weaponIcon.frameName = this.weapon.icon+'_0' // weapons icon on screen?
      Client.setWeapon(key)
    }
    return true
  }

  adjustWeapon() {
    this.weapon.position.set(this.weapon.offsets.x, this.weapon.offsets.y)
  }

  equipArmor(key) {
    const armorInfo = Game.itemsInfo[key]
    this.def = armorInfo.def
    this.armorName = key
    return true
  }
  // TODO reimplement this fn when we manage life
  updateLife() {
    if (this.life < 0) this.life = 0
    const width = Game.computeLifeBarWidth()
    const tweenWidth = this.game.add.tween(Game.health.getChildAt(0)) // tween for the "body" of the bar
    const tweenEnd = this.game.add.tween(Game.health.getChildAt(1)) // tween for the curved tip
    tweenWidth.to({ width: width }, 200, null, false, 200)
    tweenEnd.to({ x: width }, 200, null, false, 200)
    tweenWidth.start()
    tweenEnd.start()
  }

  die(animate) {
    if (this.tween) this.stopMovement(false)
    this.target = null
    this.life = 0
    if (this.isPlayer) {
      Game.moveTarget.visible = false
      this.updateLife()
      // setTimeout(Game.displayDeathScroll, Phaser.Timer.SECOND*2)
    }
    if (animate && this.inCamera) {
      this.frameName = 'death_0'
      this.animate('death', false)
      // Game.sounds.play('death')
    }
    this.delayedKill(750)
  }
  respawn() {
    this.revive() // method from the Phaser Sprite class
    this.orientation = this.game.rnd.between(1, 4)
    if (this.isPlayer) {
      this.life = this.maxLife
      this.updateLife()
    }
    this.idle(true)
  }
}
