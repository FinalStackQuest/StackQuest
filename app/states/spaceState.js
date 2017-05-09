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
    this.load.tilemap('stackQuestSpaceMap', 'assets/maps/StackQuestSpaceTilemap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('topDownShooterSheet', 'assets/tilesets/Topdown_Shooter/Tilesheet/tilesheet_complete.png')
    this.load.image('scifiSheet', 'assets/tilesets/RTS_Sci-fi/Tilesheet/scifi_tilesheet.png')
    this.load.image('mapPackSheet', 'assets/tilesets/Map_Pack/Tilesheet/mapPack_tilesheet.png')
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)
    map = this.add.tilemap('stackQuestSpaceMap')

    map.addTilesetImage('tilesheet_complete', 'topDownShooterSheet')
    map.addTilesetImage('scifi_tilesheet', 'scifiSheet')
    map.addTilesetImage('mapPack_tilesheet', 'mapPackSheet')

    const groundLayer = map.createLayer('ground_layer')
    const buildingLayer = map.createLayer('building_layer')
    const treeLayer = map.createLayer('tree_layer')

    groundLayer.resizeWorld()

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
