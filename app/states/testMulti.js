// Util functions for firebase database
import {addCharacter, GamePlayers, onCharacterUpdate, updateCoordinates, updateOnCharacterMovement} from './firebase-database'
const dummyCharId = `character${Math.floor(Math.random()*50)}`

const testObj = {
  class: 'wizard',
  position: {
    x: Math.random()*400,
    y: Math.random()*400,
    direction: 0,
    rotation: 0,
  }
}

let map
  , layer
  , cursors
  , fixedText

const testState = {
  preload() {
    this.load.spritesheet('link', '../assets/link.png', 100, 50)
    this.load.tilemap('testmap', 'maps/testmap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('tiles', 'maps/terrain.png')
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)

    map = this.add.tilemap('testmap')

    map.addTilesetImage('terrain', 'tiles')

    layer = map.createLayer('terrainlayer')

    layer.resizeWorld()

    map.setCollisionBetween(278, 280)
    map.setCollision(310)
    map.setCollision(312)
    map.setCollisionBetween(342, 344)

    this.physics.p2.convertTilemap(map, layer)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()

    addCharacter(dummyCharId, testObj)

    fixedText = GamePlayers[dummyCharId]

    this.physics.p2.enable(fixedText)

    this.camera.follow(fixedText)
  },

  update() {
    fixedText.body.setZeroVelocity()
    fixedText.body.fixedRotation = true
    if (cursors.up.isDown) {
      fixedText.body.moveUp(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, fixedText.body.rotation, dummyCharId)
    } else if (cursors.down.isDown) {
      fixedText.body.moveDown(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, fixedText.body.rotation, dummyCharId)
    } if (cursors.left.isDown) {
      fixedText.body.moveLeft(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, fixedText.body.rotation, dummyCharId)
    } else if (cursors.right.isDown) {
      fixedText.body.moveRight(200)
      updateCoordinates(fixedText.position.x, fixedText.position.y, fixedText.body.rotation, dummyCharId)
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default testState
