import { GamePlayers, socket } from '../sockets'
const Easystar = require('easystarjs')
import Enemy from '../constructor/Enemy'

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
    this.load.spritesheet('soldier', 'assets/tilesets/LPC Base Assets/sprites/people/soldier.png', 80, 74, 36)
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)
    map = this.add.tilemap('testmap')
    // console.log('map', map)
    // socket.emit('initializeMap', {tilemap: map.layers[0].data})
    map.addTilesetImage('pirate_sheet', 'pirateSheet')
    map.addTilesetImage('pirate_sheet2', 'pirateSheet2')

    const grassLayer = map.createLayer('grass_layer')
    const waterLayer = map.createLayer('water_layer')
    const stuffLayer = map.createLayer('stuff_layer')

    grassLayer.resizeWorld()
    console.log('Easystar', Easystar)
    this.makeCollisionMap()
    // console.log('did we create an easystar property on state?', this.easystar)

    const player = {
      class: 'O',
      pos: {
        x: xCoord,
        y: yCoord
      }
    }

    // create monster test
    const monster = new Enemy(this.game, 'testMonster', {x: 100, y: 100}, 'soldier')
    console.log(monster)
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
  ,
  makeCollisionMap() {
    const collisionArray = []
    for (let rowIdx = 0; rowIdx < map.height; rowIdx++) {
      const rowArray = []
      for (let colIdx = 0; colIdx < map.width; colIdx++) {
        let collision = false
        for (const layer of map.layers) {
          if (layer.data[rowIdx][colIdx].collides) {
            collision = true
            break
            // rowArray.push(1)
          }
          // else {
          //   // rowArray.push(0)
          // }
        }
        rowArray.push(Number(collision))
      }
      collisionArray.push(rowArray)
    }
    console.log('collis array?', collisionArray)
    this.easystar = new Easystar.js()
    this.easystar.setGrid(collisionArray)
    this.easystar.setAcceptableTiles([0])
    this.easystar.findPath(20, 20, 50, 50, (path) => {
      console.log('path?', path)
    })
    this.easystar.calculate()
  }

}

export default testState
