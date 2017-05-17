import { socket, GameGroups } from '../sockets'
import { createSpaceAssets } from './utils/createAssets'
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

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createSpaceAssets()

    GameGroups.items = this.game.add.group()
    GameGroups.enemies = this.game.add.group()
    GameGroups.players = this.game.add.group()
    GameGroups.HUD = this.game.add.group()
    const collisionMap = makeCollisionMap(map)
    socket.emit('setupState', player, collisionMap, 'spaceState')

    playerObject = createPlayer(player)
    playerObject.collisionMap = collisionMap
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
    playerObject.specialAttack()
    playerObject.specialMove()
    playerObject.HUD.updateNumPlayers()
    playerObject.chat()

    itemCollision(playerObject, itemGraveyard)
    enemyCollision(playerObject, graveyard)
    mapTransition(player, playerObject)
  }
}

export default spaceState
