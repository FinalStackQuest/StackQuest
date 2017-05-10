import { socket } from 'APP/app/sockets'

const playerMovement = (playerObject, cursors) => {
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
}

export default playerMovement
