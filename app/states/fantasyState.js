import { GamePlayers, socket } from '../sockets'
import throttle from 'lodash.throttle'
import Enemy from '../constructor/Enemy'
import loadMaps from './utils/loadMaps'
import buildMaps from './utils/buildMaps'
import createCursors from './utils/createCursors'
import createPlayer from './utils/createPlayer'
import createProjectile from './utils/createProjectile'
import playerMovement from './utils/playerMovement'
import playerAttack from './utils/playerAttack'
import mapTransition from './utils/mapTransition'

let map
  , cursors
  , playerObject
  , player
  , projectile
  , graveyard = []
  , counter = 0

export const localState = {
  players: [],
  enemies: {},
}

const fantasyState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.fantasy()
  },

  create() {
    localState.state = this
    this.physics.startSystem(Phaser.Physics.ARCADE)

    cursors = createCursors()
    map = buildMaps.fantasy()

    socket.emit('setupState', player, 'fantasyState')
    socket.emit('getEnemies', {state: 'fantasyState'})

    playerObject = createPlayer(player)
    localState.players.push(playerObject)
    projectile = createProjectile.bullet(playerObject)

    this.makeCollisionMap()
    this.spawnEnemy()

    this.physics.setBoundsToWorld(true, true, true, true, false)

    this.game.input.onDown.add((pointer, mouseEvent) => playerAttack(pointer, mouseEvent, playerObject, projectile), this)
    this.throttleMove = throttle(this.moveAllEnemies, 200)
  },

  update() {
    graveyard.forEach(enemy => enemy.destroy())
    graveyard = []

    playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'spaceState')

    this.throttleMove()

    for (const enemyKey in localState.enemies) {
      this.enemyPathFinding(enemyKey)
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  },

  enemyPathFinding(enemyKey) {
    const enemy = localState.enemies[enemyKey]
    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, () => {
      graveyard.push(enemy)
      delete localState.enemies[enemyKey]
    })
    StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
      playerObject.position.x = 200
      playerObject.position.y = 200
    })
    if (enemy) {
      // const closestPlayer = enemy.findClosestPlayer(localState.players)
      // // socket.emit('moveEnemy', {name: enemy.name, state: 'fantasyState'})
      // socket.emit('moveEnemy', {
      //   name: enemy.name,
      //   startingPos: {
      //     x: enemy.position.x,
      //     y: enemy.position.y
      //   },
      //   targetPos: {
      //     x: closestPlayer.position.x,
      //     y: closestPlayer.position.y,
      //   }
      // })
      socket.emit('moveEnemy', {
        name: enemy.name,
        state: 'fantasyState'
      })
    }
  },

  makeCollisionMap() {
    const collisionArray = []
    for (let rowIdx = 0; rowIdx < map.height; rowIdx++) {
      const rowArray = []
      for (let colIdx = 0; colIdx < map.width; colIdx++) {
        let collision = false
        for (const layer of map.layers) {
          if (layer.data[rowIdx][colIdx].collides) {
            collision = true
            break
          }
        }
        rowArray.push(Number(collision))
      }
      collisionArray.push(rowArray)
    }
    socket.emit('createCollisionArray', {array: collisionArray})
  },

  getPointFromGrid(rowIdx, colIdx) {
    const y = (rowIdx * map.height) + (map.height / 2)
    const x = (colIdx * map.width) + (map.width / 2)
    return new Phaser.Point(x, y)
  },

  spawnEnemy() {
    socket.emit('addEnemy', {state: 'fantasyState'})
  },

  moveAllEnemies() {
    Object.keys(localState.enemies).forEach((enemyName) => this.enemyPathFinding(localState.enemies[enemyName]), this)
  }
}

export default fantasyState
