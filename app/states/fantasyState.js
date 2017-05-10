import { GamePlayers, socket } from '../sockets'
import Easystar from 'easystarjs'
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
  , enemyCounter = 0

const localState = {
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
    this.physics.startSystem(Phaser.Physics.ARCADE)

    cursors = createCursors()
    map = buildMaps.fantasy()

    socket.emit('setupState', player, 'fantasyState')

    playerObject = createPlayer(player)
    localState.players.push(playerObject)
    projectile = createProjectile.bullet(playerObject)

    this.makeCollisionMap()
    this.spawnEnemy()

    this.physics.setBoundsToWorld(true, true, true, true, false)

    StackQuest.game.input.onDown.add((pointer, mouseEvent) => playerAttack(pointer, mouseEvent, playerObject, projectile), this)
  },

  update() {
    graveyard.forEach(enemy => enemy.destroy())
    graveyard = []

    if (Math.random() * 1000 <= 20) this.spawnEnemy()

    playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'spaceState')

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
    const closestPlayer = enemy.findClosestPlayer(localState)
    this.easystar.findPath(Math.floor(enemy.position.x / map.width), Math.floor(enemy.position.y / map.height), Math.floor(closestPlayer.position.x / map.width), Math.floor(closestPlayer.position.y / map.height), (path) => enemy.move(path, this))
    this.easystar.calculate()
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
    this.easystar = new Easystar.js()
    this.easystar.setGrid(collisionArray)
    this.easystar.setAcceptableTiles([0])
    this.easystar.enableDiagonals()
  },

  getPointFromGrid(rowIdx, colIdx) {
    const y = (rowIdx * map.height) + (map.height / 2)
    const x = (colIdx * map.width) + (map.width / 2)
    return new Phaser.Point(x, y)
  },

  spawnEnemy() {
    localState.enemies[enemyCounter++] = new Enemy(this.game, 'Soldier', { x: Math.random() * 1920, y: Math.random() * 1920 }, `${Math.random() > 0.5 ? 'soldier' : 'soldieralt'}`)
  }
}

export default fantasyState
