import { GamePlayers, socket } from '../sockets'

let map
  , cursors
  , OGuy
  , xCoord = 100
  , yCoord = 100

export const testState = {
  init(x, y) {
    if (x && y) {
      xCoord = x
      yCoord = y
    }
  },

  preload(x, y) {
    this.load.tilemap('testmap', 'assets/maps/testmap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('pirateSheet', 'assets/tilesets/Pirate_Pack_(190 assets)/Tilesheet/tiles_sheet.png')
    this.load.image('pirateSheet2', 'assets/tilesets/Pirate_Pack_(190 assets)/Tilesheet/tiles_sheet@2.png')
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)
    map = this.add.tilemap('testmap')

    map.addTilesetImage('pirate_sheet', 'pirateSheet')
    map.addTilesetImage('pirate_sheet2', 'pirateSheet2')

    const grassLayer = map.createLayer('grass_layer')
    const waterLayer = map.createLayer('water_layer')
    const stuffLayer = map.createLayer('stuff_layer')

    grassLayer.resizeWorld()

    const player = {
      class: 'O',
      pos: {
        x: xCoord,
        y: yCoord
      }
    }

    // remove player from previous map (room)
    socket.emit('removePlayer')
    // join new map
    socket.emit('joinroom', 'fantasyState')
    // get all players on the same map
    socket.emit('getPlayers')
    // add player to map
    socket.emit('addPlayer', player)

    OGuy = this.add.text(xCoord, yCoord, 'O', { font: '32px Arial', fill: '#ffffff' })

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
      this.state.start('spaceState', true, false, OGuy.position.x, this.world.bounds.bottom - OGuy.height - 10)
    } else if (OGuy.position.y >= this.world.bounds.bottom - OGuy.height) {
      this.state.start('spaceState', true, false, OGuy.position.x, this.world.bounds.top + OGuy.height + 10)
    } else if (OGuy.position.x <= this.world.bounds.left + OGuy.width) {
      this.state.start('spaceState', true, false, this.world.bounds.right - OGuy.width - 10, OGuy.position.y)
    } else if (OGuy.position.x >= this.world.bounds.right - OGuy.width) {
      this.state.start('spaceState', true, false, this.world.bounds.left + OGuy.width + 10, OGuy.position.y)
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default testState
