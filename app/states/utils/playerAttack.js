import { socket } from 'APP/app/sockets'

/* global StackQuest */

const playerAttack = (pointer, mouseEvent, playerObject, projectile) => {
  projectile.fire(null, StackQuest.game.input.worldX, StackQuest.game.input.worldY)
  socket.emit('fireProjectile', projectile, StackQuest.game.input.worldX, StackQuest.game.input.worldY)
}

export default playerAttack
