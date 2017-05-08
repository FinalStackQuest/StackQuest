import entityPrefab from './Prefab'
import _ from 'lodash'
import throttle from 'lodash.throttle'

export default class NPC extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)

    this.isPlayer = false;

    //  adds a monster child to the game with atlas keys
    this.addChild(game.add.sprite(0, 0, 'atlas1', 'shadow'))

    //  To do: add correct animation frames
    this.animations.add('placeholder', [9, 10, 11, 12, 9, 13, 14], 9, true)
    this.animations.add('placeholder', [1, 2, 3, 4, 5, 6, 7, 8, 0], 9, false)


    this.stats = {
      hp: 10,
      attack: 10,
      defense: 4,
      speed: 10,
    }

    this.currentTarget = null
    this.hit = false
    this.moveTo = throttle(this.moveTo, 1000)
    this.acquireTarget = throttle(this.acquireTarget, 1000)
    this.attacking = false
  }


  moveTo(position) {
    const distX = this.position.x - this.game.state.callbackContext.currentPlayerSprite.x
    const distY = this.position.y - this.game.state.callbackContext.currentPlayerSprite.y

    if (this.hit === false) {
      this.gameState.pathfinding.findPath(this.position, position, this.followPath, this)
    }
  }

  followPath(path) {
    // console.log('inside path', path)
    let movingTween, pathLength
    movingTween = this.game.tweens.create(this)
    pathLength = path.length

    if (this.hit === false) {
    //  If path is 0, attack the current target
      if (pathLength <= 0) {
        this.attackPlayer(this.currentTarget)
      } else {
        console.log(movingTween)
        path.forEach(position => {
          movingTween.to({x: position.x, y: position.y}, 350, Phaser.Easing.LINEAR)
        })

        movingTween.start()
        console.log('starting tween', movingTween)
      }
    }
  }

  acquireTarget(playersAry) {
    let newTarget = playersAry.getFirstAlive()
    let distance = 0

    playersAry.forEachAlive((player) => {
      let playerDistance = Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2)

      if (distance <= playerDistance) {
        distance = playerDistance
        newTarget = player
      }
    })

    this.currentTarget = newTarget
    return newTarget
  }

  //  to do functionality!!
  setup() {}
  setupMovement() {}
  attackPlayer(player) {
    this.attacking = true
    //  TO DO: add tween logic here:
    player.receiveDamage(this.stats.attack)
  }
  attackAction() {}
  die() {}
  respawn() {}
}


