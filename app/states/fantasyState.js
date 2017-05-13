import { collisionArrayStatus, GameEnemies, GamePlayers, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import createMap from './utils/createMap'
import createCursors from './utils/createCursors'
import createPlayer from './utils/createPlayer'
import createProjectile from './utils/createProjectile'
import playerMovement from './utils/playerMovement'
import playerAttack from './utils/playerAttack'
import mapTransition from './utils/mapTransition'
import enemyCollision from './utils/enemyCollision'
import makeCollisionMap from './utils/makeCollisionMap'
import itemCollision from './utils/itemCollision'
import playerClass from '../classes/Player'
import Loot from '../classes/Loot'

/* global StackQuest, Phaser */

let map
  , cursors
  , playerObject
  , player
  , projectile
  , graveyard = []
  , lootGeneratedCounter = 0

// TODO get rid of this (put in sockets) ?
const localState = {
  loot: []
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
    map = createMap.fantasy()

    socket.emit('setupState', player, 'fantasyState')

    playerObject = createPlayer(player)

    if (!collisionArrayStatus) {
      makeCollisionMap(map)
    }

    this.spawnLoot()

    this.physics.setBoundsToWorld(true, true, true, true, false)
  },

  update() {
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions)
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions_2)

    graveyard.forEach(enemy => {
      enemy.destroy()
      delete GameEnemies[enemy.name]
      socket.emit('killEnemy', enemy.name)
    })
    graveyard = []

    playerObject.movePlayer()
    playerObject.attack()

    if (Math.random() * 1000 <= 1) this.spawnLoot()

    for (const enemyKey in localState.enemies) {
      this.enemyPathFinding(enemyKey)
    }

    itemCollision(playerObject, playerObject.weapon, localState.loot)
    enemyCollision(playerObject, playerObject.weapon, graveyard)
    mapTransition(player, playerObject, 'spaceState')
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  },

  spawnLoot() {
    localState.loot[lootGeneratedCounter++] = new Loot(this.game, 'Item', { x: Math.random() * 1920, y: Math.random() * 1080 }, 'item')
  }
}

export default fantasyState
