import { collisionArrayStatus, GamePlayers, GameEnemies, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import createMap from './utils/createMap'
import makeCollisionMap from './utils/makeCollisionMap'
import createPlayer from './utils/createPlayer'
import enemyCollision from './utils/enemyCollision'
import mapTransition from './utils/mapTransition'
import itemCollision from './utils/itemCollision'
import playerClass from '../classes/Player'
import Loot from '../classes/Loot'

/* global StackQuest, Phaser */

let map
  , playerObject
  , player
  , projectile
  , graveyard = []
  , itemGraveyard = []

const fantasyState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.fantasy()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createMap.fantasy()

    socket.emit('setupState', player, 'fantasyState')

    playerObject = createPlayer(player)
    projectile = playerObject.getProjectile()

    if (!collisionArrayStatus) {
      makeCollisionMap(map)
    }

    this.physics.setBoundsToWorld(true, true, true, true, false)

    StackQuest.game.input.onDown.add(() => playerObject.attack())
  },

  update() {
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions)
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions_2)

    graveyard.forEach(enemy => {
      enemy.destroy()
      socket.emit('killEnemy', enemy.name)
    })
    graveyard = []

    // TODO make more sense...
    itemGraveyard.forEach(item => {
      item.destroy()
      console.log('item killed ', item.name)
      socket.emit('killItem', item.name)
    })
    itemGraveyard = []

    playerObject.movePlayer()
    itemCollision(playerObject, projectile, itemGraveyard)
    enemyCollision(playerObject, projectile, graveyard)
    mapTransition(player, playerObject, 'spaceState')
  }

}

export default fantasyState
