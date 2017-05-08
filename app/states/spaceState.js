import { GamePlayers, socket } from '../sockets'

let map
  , cursors
  , XGuy
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
      class: 'X',
      pos: {
        x: xCoord,
        y: yCoord
      }
    }

    socket.emit('getPlayers')
    socket.emit('addPlayer', player)
    XGuy = this.add.text(xCoord, yCoord, 'X', { font: '32px Arial', fill: '#ffffff' })

    this.physics.p2.enable(XGuy)

    this.camera.follow(XGuy)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    XGuy.body.setZeroVelocity()
    XGuy.body.fixedRotation = true

    if (cursors.up.isDown) {
      XGuy.body.moveUp(200)
      socket.emit('updatePlayer', XGuy.position)
    } else if (cursors.down.isDown) {
      XGuy.body.moveDown(200)
      socket.emit('updatePlayer', XGuy.position)
    }
    if (cursors.left.isDown) {
      XGuy.body.moveLeft(200)
      socket.emit('updatePlayer', XGuy.position)
    } else if (cursors.right.isDown) {
      XGuy.body.moveRight(200)
      socket.emit('updatePlayer', XGuy.position)
    }

    if (XGuy.position.y <= this.world.bounds.top + XGuy.height) {
      this.state.start('fantasyState', true, false, XGuy.position.x, this.world.bounds.bottom - XGuy.height - 10)
      socket.emit('removePlayer')
    } else if (XGuy.position.y >= this.world.bounds.bottom - XGuy.height) {
      this.state.start('fantasyState', true, false, XGuy.position.x, this.world.bounds.top + XGuy.height + 10)
      socket.emit('removePlayer')
    } else if (XGuy.position.x <= this.world.bounds.left + XGuy.width) {
      this.state.start('fantasyState', true, false, this.world.bounds.right - XGuy.width - 10, XGuy.position.y)
      socket.emit('removePlayer')
    } else if (XGuy.position.x >= this.world.bounds.right - XGuy.width) {
      this.state.start('fantasyState', true, false, this.world.bounds.left + XGuy.width + 10, XGuy.position.y)
      socket.emit('removePlayer')
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default testState
