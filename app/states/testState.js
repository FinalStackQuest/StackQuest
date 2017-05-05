import StackQuest from '../main'

let map
  , layer
  , cursors
  , fixedText

const testState = {
  preload() {
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

    fixedText = StackQuest.add.text(100, 100, 'O', { font: '32px Arial', fill: '#ffffff', align: 'center' })
    StackQuest.physics.p2.enable(fixedText)

    StackQuest.camera.follow(fixedText)

    StackQuest.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = StackQuest.input.keyboard.createCursorKeys()
  },

  update() {
    fixedText.body.setZeroVelocity()

    if (cursors.up.isDown) {
      fixedText.body.moveUp(200)
    } else if (cursors.down.isDown) {
      fixedText.body.moveDown(200)
    } if (cursors.left.isDown) {
      fixedText.body.moveLeft(200)
    } else if (cursors.right.isDown) {
      fixedText.body.moveRight(200)
    }
  },

  render() {
    StackQuest.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default testState
