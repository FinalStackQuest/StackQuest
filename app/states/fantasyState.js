import { socket, GameGroups } from '../sockets'
import createAssets from './utils/createAssets'
import makeCollisionMap from './utils/makeCollisionMap'
import createPlayer from './utils/createPlayer'
import enemyCollision from './utils/enemyCollision'
import mapTransition from './utils/mapTransition'
import itemCollision from './utils/itemCollision'
import playerCollision from './utils/playerCollision'
import playerClass from '../classes/Player'
import Loot from '../classes/Loot'

/* global StackQuest, Phaser */

let map
  , playerObject
  , player
  , graveyard = []
  , itemGraveyard = []

const fantasyState = {
  init(character) {
    if (character) player = character
  },

  preload() {

  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createAssets.fantasy()

    GameGroups.items = this.game.add.group()
    GameGroups.enemies = this.game.add.group()
    GameGroups.players = this.game.add.group()
    GameGroups.HUD = this.game.add.group()

    socket.emit('setupState', player, makeCollisionMap(map), 'fantasyState')

    playerObject = createPlayer(player)

    this.physics.setBoundsToWorld(true, true, true, true, false)
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
    playerObject.attack()

    itemCollision(playerObject, itemGraveyard)
    enemyCollision(playerObject, graveyard)
    playerCollision(playerObject)
    mapTransition(player, playerObject, 'spaceState')
  }
}

export default fantasyState
