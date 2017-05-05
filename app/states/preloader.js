// import {addCharacter, onCharacterUpdate, updateCoordinates, updateOnCharacterMovement} from './firebase-database'
// import {PlayerState} from './player'
//
// let map
//   , layer
//
// const PreloaderState = {
//   preload: () => {
//     this.load.tilemap('testmap', 'maps/testmap.json', null, Phaser.Tilemap.TILED_JSON)
//     this.load.image('tiles', 'maps/terrain.png')
//   },
//   create: () => {
//     this.physics.startSystem(Phaser.Physics.P2JS)
//
//     map = this.add.tilemap('testmap')
//
//     map.addTilesetImage('terrain', 'tiles')
//
//     layer = map.createLayer('terrainlayer')
//
//     layer.resizeWorld()
//
//     map.setCollisionBetween(278, 280)
//     map.setCollision(310)
//     map.setCollision(312)
//     map.setCollisionBetween(342, 344)
//
//     this.physics.p2.convertTilemap(map, layer)
//     this.physics.p2.setBoundsToWorld(true, true, true, true, false)
//     this.state.start('player')
//   }
// }
