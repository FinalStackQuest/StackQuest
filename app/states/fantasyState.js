import { GamePlayers, socket } from '../sockets'
// const Easystar = require('easystarjs')
import Enemy from '../constructor/Enemy'
import throttle from 'lodash.throttle'

let map
  , cursors
  , OGuy
  , xCoord = 100
  , yCoord = 100
  , monster

const localState = {
  players: [],
  enemies: {},
}

import loadMaps from './utils/loadMaps'
import buildMaps from './utils/buildMaps'
import playerMovement from './utils/playerMovement'
import mapTransition from './utils/mapTransition'

let playerObject
  , player

export const fantasyState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.fantasy()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)

    map = buildMaps.fantasy()
    this.makeCollisionMap()

    socket.emit('setupState', player, 'fantasyState')
    socket.emit('getEnemies', {state: 'fantasyState'})
    socket.on('sendEnemies', (enemies) => {
      Object.keys(enemies).forEach(enemyName => {
        const enemy = enemies[enemyName]
        localState.enemies[enemy.name] = new Enemy(this.game, enemy.name, {x: +enemy.x, y: +enemy.y}, enemy.key)
      }, this)
    })

    playerObject = StackQuest.game.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })
    localState.players.push(playerObject)

    this.spawnEnemy()

    this.physics.p2.enable(playerObject)

    this.camera.follow(playerObject)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'spaceState')
    socket.on('enemyCreated', (enemy) => {
      localState.enemies[enemy.name] = new Enemy(this.game, enemy.name, {x: enemy.x, y: enemy.y}, enemy.key)
    })

  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  },

  enemyPathFinding(enemy) {
    const closestPlayer = enemy.findClosestPlayer(localState)

    socket.emit('moveEnemy', {
      name: enemy.name,
      startPosition: {
        x: enemy.position.x,
        y: enemy.position.y
      },
      targetPosition: {
        x: closestPlayer.position.x,
        y: closestPlayer.position.y
      }
    })
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
    socket.emit('addEnemy')
  },
  moveAllEnemies() {
    Object.keys(localState.enemies).forEach((enemyName) => this.enemyPathFinding(localState.enemies[enemyName]), this)
  }
}

export default fantasyState
