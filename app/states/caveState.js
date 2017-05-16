import { socket, GameGroups } from '../sockets'
import { createCaveAssets } from './utils/createAssets'
import makeCollisionMap from './utils/makeCollisionMap'
import createPlayer, { assignClass } from './utils/createPlayer'
import enemyCollision from './utils/enemyCollision'
import mapTransition from './utils/mapTransition'
import itemCollision from './utils/itemCollision'
import playerCollision from './utils/playerCollision'
import playerClass from '../classes/Player'
import Loot from '../classes/Loot'

/* global StackQuest, Phaser */

let playerObject
  , player
  , cyborg
  , wizard

const caveState = {
  init(character) {
    if (character) player = character
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    createCaveAssets()

    wizard = this.game.add.sprite(208, 225, 'wizard', 18)
    cyborg = this.game.add.sprite(1300, 225, 'cyborg', 18)
    this.game.physics.arcade.enable(wizard)
    this.game.physics.arcade.enable(cyborg)

    GameGroups.players = this.game.add.group()
    playerObject = createPlayer(player)

    this.physics.setBoundsToWorld(true, true, true, true, false)
  },

  update() {
    this.game.physics.arcade.collide(playerObject, this.game.layers.collisions)
    this.game.physics.arcade.collide(playerObject, this.game.layers.collisions_2)

    this.game.physics.arcade.overlap(playerObject, wizard, () => {
      this.assignClass('wizard')
    })
    this.game.physics.arcade.overlap(playerObject, cyborg, () => {
      this.assignClass('cyborg')
    })

    playerObject.movePlayer()
    playerObject.chat()
  },

  assignClass(charClass) {
    player.class = charClass
    player.currentMap = charClass === 'wizard' ? 'fantasyState' : 'spaceState'
    playerObject.player = player
    playerObject.savePlayer()
    this.state.start(player.currentMap, true, false, player)
  }
}

export default caveState
