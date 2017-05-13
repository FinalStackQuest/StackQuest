import { GamePlayers, GameEnemies, socket } from '../sockets'
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
  , graveyard = []
  , itemGraveyard = []

const spaceState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.space()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createMap.space()

    socket.emit('setupState', player, makeCollisionMap(map), 'spaceState')

    playerObject = createPlayer(player)

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

    itemGraveyard.forEach(item => {
      item.destroy()
      socket.emit('killItem', item.name)
    })
    itemGraveyard = []

    playerObject.movePlayer()
    itemCollision(playerObject, localState.loot)
    enemyCollision(playerObject, graveyard, localState.loot)
    mapTransition(player, playerObject, 'fantasyState')
  }
}

export default spaceState
