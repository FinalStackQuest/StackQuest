import { socket } from 'APP/app/sockets'

const playerMovement = (playerObject, cursors) => {
  playerObject.body.velocity.x = 0
  playerObject.body.velocity.y = 0
  playerObject.rotation = StackQuest.game.physics.arcade.angleToPointer(playerObject)

  if (cursors.up.isDown) {
    playerObject.body.velocity.y = -200
    socket.emit('updatePlayer', playerObject.position)
  } else if (cursors.down.isDown) {
    playerObject.body.velocity.y = 200
    socket.emit('updatePlayer', playerObject.position)
  }
  if (cursors.left.isDown) {
    playerObject.body.velocity.x = -200
    socket.emit('updatePlayer', playerObject.position)
  } else if (cursors.right.isDown) {
    playerObject.body.velocity.x = 200
    socket.emit('updatePlayer', playerObject.position)
  }
}

export default playerMovement
