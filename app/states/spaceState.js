import { GamePlayers, socket } from '../sockets'

let map
  , cursors
  , playerObject
  , player

export const spaceState = {
  init(character) {
    if (character) player = character
  },

  preload(x, y) {
    this.load.tilemap('stackQuestFantasyMap', 'assets/maps/StackQuestFantasyTilemap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('pirateSheet', 'assets/tilesets/Pirate_Pack_(190 assets)/Tilesheet/tiles_sheet.png')
    this.load.image('pirateSheet2', 'assets/tilesets/Pirate_Pack_(190 assets)/Tilesheet/tiles_sheet@2.png')
    this.load.image('rtsSheet2', 'assets/tilesets/RTS_Medieval_(120 assets)/Tilesheet/RTS_medieval@2.png')
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)
    map = this.add.tilemap('stackQuestFantasyMap')

    map.addTilesetImage('pirate_sheet', 'pirateSheet')
    map.addTilesetImage('pirate_sheet2', 'pirateSheet2')
    map.addTilesetImage('rts_medieval_sheet2', 'rtsSheet2')

    const grassLayer = map.createLayer('grass_layer')
    const waterLayer = map.createLayer('water_layer')
    const stuffLayer = map.createLayer('stuff_layer')

    grassLayer.resizeWorld()

    // remove player from previous map (room)
    socket.emit('removePlayer')
    // join new map
    socket.emit('joinroom', 'spaceState')
    // get all players on the same map
    socket.emit('getPlayers')
    // add player to map
    socket.emit('addPlayer', player)

    playerObject = this.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })

    this.physics.p2.enable(playerObject)

    this.camera.follow(playerObject)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    playerObject.body.setZeroVelocity()
    playerObject.body.fixedRotation = true

    if (cursors.up.isDown) {
      playerObject.body.moveUp(200)
      socket.emit('updatePlayer', playerObject.position)
    } else if (cursors.down.isDown) {
      playerObject.body.moveDown(200)
      socket.emit('updatePlayer', playerObject.position)
    }
    if (cursors.left.isDown) {
      playerObject.body.moveLeft(200)
      socket.emit('updatePlayer', playerObject.position)
    } else if (cursors.right.isDown) {
      playerObject.body.moveRight(200)
      socket.emit('updatePlayer', playerObject.position)
    }

    if (playerObject.position.y <= this.world.bounds.top + playerObject.height) {
      player.x = playerObject.position.x
      player.y = this.world.bounds.bottom - playerObject.height - 10
      player.currentMap = 'fantasyState'
      this.state.start(player.currentMap, true, false, player)
    } else if (playerObject.position.y >= this.world.bounds.bottom - playerObject.height) {
      player.x = playerObject.position.x
      player.y = this.world.bounds.top + playerObject.height + 10
      player.currentMap = 'fantasyState'
      this.state.start(player.currentMap, true, false, player)
    } else if (playerObject.position.x <= this.world.bounds.left + playerObject.width) {
      player.x = this.world.bounds.right - playerObject.width - 10
      player.y = playerObject.position.y
      player.currentMap = 'fantasyState'
      this.state.start(player.currentMap, true, false, player)
    } else if (playerObject.position.x >= this.world.bounds.right - playerObject.width) {
      player.x = this.world.bounds.left + playerObject.width + 10
      player.y = playerObject.position.y
      player.currentMap = 'fantasyState'
      this.state.start(player.currentMap, true, false, player)
    }
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default spaceState
