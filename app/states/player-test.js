// import {addCharacter, onCharacterUpdate, updateCoordinates, updateOnCharacterMovement} from './firebase-database'
//
// const GamePlayers = {}
// let player
//   , cursors
//
// const dummyCharacterId = `character${Math.floor(Math.random()*50)}`
// const dummyData = {
//   class: 'wizard',
//   position: {
//     x: Math.random()*400,
//     y: Math.random()*400,
//     direction: 0
//   }
// }
//
// export const PlayerState = {
//   create: () => {
//     player = this.add.text(dummyData.position.x, dummyData.position.y, 'wizard', { font: '32px Arial', fill: '#ffffff', align: 'center' })
//     this.physics.p2.enable(player)
//     this.camera.follow(player)
//     addCharacter(dummyCharacterId, dummyData)
//
//     cursors = this.input.keyboard.createCursorKeys()
//   },
//   update: () => {
//     // Player Action
//     player.body.setZeroVelocity()
//     if (cursors.up.isDown) {
//       player.body.moveUp(200)
//       updateCoordinates(player.position.x, player.position.y, dummyCharacterId)
//     } else if (cursors.down.isDown) {
//       player.body.moveDown(200)
//       updateCoordinates(player.position.x, player.position.y, dummyCharacterId)
//     } if (cursors.left.isDown) {
//       player.body.moveLeft(200)
//       updateCoordinates(player.position.x, player.position.y, dummyCharacterId)
//     } else if (cursors.right.isDown) {
//       player.body.moveRight(200)
//       updateCoordinates(player.position.x, player.position.y, dummyCharacterId)
//     }
//   },
//   render() {
//     this.debug.cameraInfo(this.camera, 32, 32)
//   }
// }
