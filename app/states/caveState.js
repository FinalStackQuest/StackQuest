import { socket, GameGroups } from '../sockets'
import { createCaveAssets } from './utils/createAssets'
import makeCollisionMap from './utils/makeCollisionMap'
<<<<<<< HEAD
import createPlayer from './utils/createPlayer'
=======
import createPlayer, { assignClass } from './utils/createPlayer'
import enemyCollision from './utils/enemyCollision'
import mapTransition from './utils/mapTransition'
import itemCollision from './utils/itemCollision'
import playerCollision from './utils/playerCollision'
>>>>>>> 5cccb9d97278bf1ce1c66d9c0d1f7853fb5b262c
import playerClass from '../classes/Player'
import playerProperties from '../properties/playerProperties.json'

/* global StackQuest, Phaser */

let playerObject
  , player
  , cyborg
  , wizard
  , directions
  , classSpecs
  , toggleChoice = false

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

    this.createDirections()

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

    if (!toggleChoice && playerObject.position.y < 500) {
      const charClass = playerObject.position.x < 783 ? 'wizard' : 'cyborg'
      this.extendedDirection(charClass)
      this.defineClassSpecs(charClass)
    }

    if (toggleChoice && playerObject.position.y > 550) {
      this.defaultDirection()
      classSpecs.destroy()
      toggleChoice = false
    }
  },

  assignClass(charClass) {
    player.class = charClass
    player.currentMap = charClass === 'wizard' ? 'fantasyState' : 'spaceState'
    playerObject.player = player
    playerObject.savePlayer()
    this.state.start(player.currentMap, true, false, player)
  },

  createDirections() {
    const gameX = this.game.width
    const gameY = this.game.height
    directions = this.game.add.text(gameX / 2, gameY - 70, `Welcome to StackQuest ${playerObject.name}!`, {
      font: '17px Press Start 2P',
      fill: '#fff',
      strokeThickness: 1
    })
    directions.anchor.set(0.5)
    directions.fixedToCamera = true
    setTimeout(() => directions.setText('To get started you need to give your character a class'), 2000)
    setTimeout(() => directions.setText('StackQuest offers two classes. A wizard and a cyborg'), 5000)
    setTimeout(() => this.defaultDirection(), 8000)
  },

  defaultDirection() {
    directions.setText('  Follow the path on your left to become a wizard!\nOr, follow the path on your right to become a cyborg!')
  },

  extendedDirection(charClass) {
    const side = charClass === 'wizard' ? 'right' : 'left'
    directions.setText(`          Interested in being a ${charClass}?
      Check its base statistics on the ${side}
      If you are set, approach that ${charClass}!`)
    toggleChoice = true
  },

  defineClassSpecs(charClass) {
    const targetX = charClass === 'wizard' ? 663 : 243
    const classProps = playerProperties[charClass]
    classSpecs = this.game.add.text(targetX, 140,
      `
      class: ${charClass}
      hp: ${classProps.stats.maxHp}
      attack: ${classProps.stats.attack}
      defense: ${classProps.stats.defense}
      speed: ${classProps.stats.speed}
      weapon: ${classProps.weaponKey}`, {
      font: '17px Press Start 2P',
      fill: '#fff',
      strokeThickness: 1
    })
    classSpecs.anchor.set(0.5)
    classSpecs.fixedToCamera = true
  }

}

export default caveState
