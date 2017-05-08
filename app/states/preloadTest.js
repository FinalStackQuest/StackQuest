import { socket } from '../main'
import { GamePlayers } from '../sockets'
import { CharacterConstructor } from './staticClass'

let charObj = new CharacterConstructor('wizard')

charObj.speak()

let map
  , cursors
  , OGuy
  , xCoord = 100
  , yCoord = 100

export const preloadTest = {
  init(x, y) {
    if (x && y) {
      xCoord = x
      yCoord = y
    }
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)

    map = this.add.tilemap('testmap')

    map.addTilesetImage('terrain', 'terrainTiles')
    map.addTilesetImage('base_out_atlas', 'baseOutAtlasTiles')

    const grassLayer = map.createLayer('grass_terrain')
    const waterLayer = map.createLayer('water_terrain')
    const treeRootLayer = map.createLayer('tree_root_layer')
    const treeTrunkLayer = map.createLayer('tree_trunk_layer')
    const treeTopLayer = map.createLayer('tree_top_layer')

    waterLayer.resizeWorld()

    map.setCollisionBetween(29, 30, true, waterLayer)
    map.setCollisionBetween(61, 62, true, waterLayer)
    map.setCollisionBetween(92, 94, true, waterLayer)
    map.setCollisionBetween(124, 126, true, waterLayer)
    map.setCollisionBetween(156, 158, true, waterLayer)
    map.setCollisionBetween(188, 190, true, waterLayer)
    map.setCollision(2715, true, treeRootLayer)
    map.setCollision(2718, true, treeRootLayer)

    this.physics.p2.convertTilemap(map, waterLayer)
    this.physics.p2.convertTilemap(map, treeRootLayer)

    const player = {
      class: 'O',
      pos: {
        x: xCoord,
        y: yCoord
      }
    }

    socket.emit('getPlayers')
    socket.emit('addPlayer', player)
    OGuy = this.add.text(xCoord, yCoord, 'O', { font: '32px Arial', fill: '#ffffff' })

    // OGuy = this.add.text(xCoord, yCoord, 'O', { font: '32px Arial', fill: '#ffffff', align: 'center' })
    this.physics.p2.enable(OGuy)

    this.camera.follow(OGuy)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    OGuy.body.setZeroVelocity()
    OGuy.body.fixedRotation = true

    if (cursors.up.isDown) {
      OGuy.body.moveUp(200)
      socket.emit('updatePlayer', OGuy.position)
    } else if (cursors.down.isDown) {
      OGuy.body.moveDown(200)
      socket.emit('updatePlayer', OGuy.position)
    }
    if (cursors.left.isDown) {
      OGuy.body.moveLeft(200)
      socket.emit('updatePlayer', OGuy.position)
    } else if (cursors.right.isDown) {
      OGuy.body.moveRight(200)
      socket.emit('updatePlayer', OGuy.position)
    }

    if (OGuy.position.y <= this.world.bounds.top + OGuy.height) {
      this.state.start('testStateTwo', true, false, OGuy.position.x, this.world.bounds.bottom - OGuy.height - 10)
      socket.emit('removePlayer')
    } else if (OGuy.position.y >= this.world.bounds.bottom - OGuy.height) {
      this.state.start('testStateTwo', true, false, OGuy.position.x, this.world.bounds.top + OGuy.height + 10)
      socket.emit('removePlayer')
    } else if (OGuy.position.x <= this.world.bounds.left + OGuy.width) {
      this.state.start('testStateTwo', true, false, this.world.bounds.right - OGuy.width - 10, OGuy.position.y)
      socket.emit('removePlayer')
    } else if (OGuy.position.x >= this.world.bounds.right - OGuy.width) {
      this.state.start('testStateTwo', true, false, this.world.bounds.left + OGuy.width + 10, OGuy.position.y)
      socket.emit('removePlayer')
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default preloadTest
