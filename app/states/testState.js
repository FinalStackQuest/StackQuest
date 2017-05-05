let map
  , grassLayer
  , waterLayer
  , treeRootLayer
  , treeTrunkLayer
  , treeTopLayer
  , cursors
  , fixedText

const testState = {
  preload() {
    this.load.tilemap('testmap', 'assets/maps/testmap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('terrainTiles', 'assets/tilesets/LPC_Terrain/terrain.png')
    this.load.image('terrainAtlasTiles', 'assets/tilesets/Atlas/base_out_atlas.png')
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)

    map = this.add.tilemap('testmap')

    map.addTilesetImage('terrain', 'terrainTiles')
    map.addTilesetImage('terrain_atlas', 'terrainAtlasTiles')

    grassLayer = map.createLayer('grass_terrain')
    waterLayer = map.createLayer('water_terrain')
    treeRootLayer = map.createLayer('tree_root_layer')
    treeTrunkLayer = map.createLayer('tree_trunk_layer')
    treeTopLayer = map.createLayer('tree_top_layer')

    waterLayer.resizeWorld()

    map.setCollisionBetween(21, 22, true, waterLayer)
    map.setCollisionBetween(60, 61, true, waterLayer)
    map.setCollisionBetween(91, 93, true, waterLayer)
    map.setCollisionBetween(123, 125, true, waterLayer)
    map.setCollisionBetween(155, 157, true, waterLayer)
    map.setCollisionBetween(187, 189, true, waterLayer)
    map.setCollision(1691, true, treeRootLayer)

    this.physics.p2.convertTilemap(map, waterLayer)
    this.physics.p2.convertTilemap(map, treeRootLayer)

    fixedText = this.add.text(100, 100, 'O', { font: '32px Arial', fill: '#ffffff', align: 'center' })
    this.physics.p2.enable(fixedText)

    this.camera.follow(fixedText)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    fixedText.body.setZeroVelocity()
    fixedText.body.fixedRotation = true

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
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default testState
