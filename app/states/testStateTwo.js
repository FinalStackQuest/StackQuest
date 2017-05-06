let map
  , grassLayer
  , waterLayer
  , treeRootLayer
  , treeTrunkLayer
  , treeTopLayer
  , cursors
  , XGuy
  , xCoord = 100
  , yCoord = 100

const testState = {
  init(x, y) {
    if (x && y) {
      xCoord = x
      yCoord = y
    }
  },

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

    XGuy = this.add.text(xCoord, yCoord, 'X', { font: '32px Arial', fill: '#ffffff', align: 'center' })
    this.physics.p2.enable(XGuy)

    this.camera.follow(XGuy)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    XGuy.body.setZeroVelocity()
    XGuy.body.fixedRotation = true

    if (XGuy.position.y <= this.world.bounds.top + XGuy.height) {
      this.state.start('testStateOne', true, false, XGuy.position.x, this.world.bounds.bottom - XGuy.height - 10)
    }
    if (XGuy.position.y >= this.world.bounds.bottom - XGuy.height) {
      this.state.start('testStateOne', true, false, XGuy.position.x, this.world.bounds.top + XGuy.height + 10)
    }
    if (XGuy.position.x <= this.world.bounds.left + XGuy.width) {
      this.state.start('testStateOne', true, false, this.world.bounds.right - XGuy.width - 10, XGuy.position.y)
    }
    if (XGuy.position.x >= this.world.bounds.right - XGuy.width) {
      this.state.start('testStateOne', true, false, this.world.bounds.left + XGuy.width + 10, XGuy.position.y)
    }

    if (cursors.up.isDown) {
      XGuy.body.moveUp(200)
    } else if (cursors.down.isDown) {
      XGuy.body.moveDown(200)
    } if (cursors.left.isDown) {
      XGuy.body.moveLeft(200)
    } else if (cursors.right.isDown) {
      XGuy.body.moveRight(200)
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default testState
