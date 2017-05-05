import StackQuest from '../main'

// Util functions for firebase database
import {addCharacter, GamePlayers, onCharacterUpdate, updateCoordinates, updateOnCharacterMovement} from './firebase-database'
const dummyCharId = `character${Math.floor(Math.random()*50)}`

let map
  , layer
  , cursors
  , fixedText

const testState = {
  preload() {
    StackQuest.load.spritesheet('link', '../assets/link.png', 100, 100)
    StackQuest.load.tilemap('testmap', 'maps/testmap.json', null, Phaser.Tilemap.TILED_JSON)
    StackQuest.load.image('tiles', 'maps/terrain.png')
  },

  create() {
    StackQuest.physics.startSystem(Phaser.Physics.P2JS)

    map = StackQuest.add.tilemap('testmap')

    map.addTilesetImage('terrain', 'tiles')

    layer = map.createLayer('terrainlayer')

    layer.resizeWorld()

    map.setCollisionBetween(278, 280)
    map.setCollision(310)
    map.setCollision(312)
    map.setCollisionBetween(342, 344)

    StackQuest.physics.p2.convertTilemap(map, layer)

    const testObj = {
      class: 'wizard',
      position: {
        x: Math.random()*400,
        y: Math.random()*400,
        direction: 0,
        rotation: 0,
      }
    }

    StackQuest.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = StackQuest.input.keyboard.createCursorKeys()

    addCharacter(dummyCharId, testObj)

    fixedText = GamePlayers[dummyCharId]

    StackQuest.physics.p2.enable(fixedText)

    StackQuest.camera.follow(fixedText)
  },

  update() {
    fixedText.body.setZeroVelocity()
    if (cursors.up.isDown) {
      fixedText.body.moveUp(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, 0, dummyCharId)
    } else if (cursors.down.isDown) {
      fixedText.body.moveDown(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, 0, dummyCharId)
    } if (cursors.left.isDown) {
      fixedText.body.moveLeft(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, 0, dummyCharId)
    } else if (cursors.right.isDown) {
      fixedText.body.moveRight(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, 0, dummyCharId)
    }
  },

  render() {
    StackQuest.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default testState
