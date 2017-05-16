import { socket, GameGroups } from '../sockets'
import { createPvpAssets } from './utils/createAssets'
import makeCollisionMap from './utils/makeCollisionMap'
import makeDeathMap from './utils/makeDeathMap'
import createPlayer from './utils/createPlayer'
import mapTransition from './utils/mapTransition'
import playerCollision from './utils/playerCollision'
import playerClass from '../classes/Player'

/* global StackQuest, Phaser */

let map
  , playerObject
  , player


const fantasyState = {
  init(character) {
    if (character) player = character
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createPvpAssets()

    GameGroups.players = this.game.add.group()
    GameGroups.HUD = this.game.add.group()

    //  socket.emit('setup death tiles')
    // socket.emit('setupState', player, makeCollisionMap(map), 'playerArena')

    playerObject = createPlayer(player)

    this.physics.setBoundsToWorld(true, true, true, true, false)
  },

  update() {
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions)
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions_2)

    playerObject.movePlayer()
    playerObject.attack()
    playerObject.specialAttack()

    playerCollision(playerObject)
    mapTransition(player, playerObject, 'fantasyState')
  }
}

export default fantasyState
