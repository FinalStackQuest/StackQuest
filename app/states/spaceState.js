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

/* global StackQuest, Phaser */

let map
  , cursors
  , playerObject
  , player
  , projectile
  , graveyard = []

const spaceState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.space()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    cursors = createCursors()
    map = createMap.space()
    socket.emit('setupState', player, 'spaceState')

    playerObject = createPlayer(player)
    projectile = createProjectile.bullet(playerObject)

    if (!collisionArrayStatus) {
      makeCollisionMap(map)
    }

    this.physics.setBoundsToWorld(true, true, true, true, false)

    StackQuest.game.input.onDown.add((pointer, mouseEvent) => playerAttack(pointer, mouseEvent, playerObject, projectile), this)
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
    enemyCollision(playerObject, projectile, graveyard)

    mapTransition(player, playerObject, 'fantasyState')
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default spaceState
