import { socket } from '../sockets'
import { createPvpAssets } from './utils/createAssets'
import makeCollisionMap from './utils/makeCollisionMap'
import createPlayer from './utils/createPlayer'
import mapTransition from './utils/mapTransition'
import playerCollision from './utils/playerCollision'
import playerClass from '../classes/Player'
import Game from '../classes/Game'

/* global StackQuest, Phaser */

let map
  , playerObject
  , player

const spaceState = {
  init(character) {
    if (character) player = character
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createPvpAssets()

    Game.GameGroups.players = this.game.add.group()
    Game.GameGroups.HUD = this.game.add.group()

    socket.emit('setupState', player, makeCollisionMap(map), 'arenaState')

    playerObject = createPlayer(player)

    this.physics.setBoundsToWorld(true, true, true, true, false)
  },

  update() {
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions)
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions_2)

    playerObject.movePlayer()
    playerObject.attack()
    playerObject.specialAttack()
    playerObject.HUD.updateNumPlayers()
    playerObject.chat()

    playerCollision(playerObject)
    mapTransition(player, playerObject)
  }
}

export default spaceState
