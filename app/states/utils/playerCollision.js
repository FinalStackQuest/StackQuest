/* global StackQuest */

import { GamePlayers, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const playerCollision = (playerObject) => {
  Object.keys(GamePlayers).forEach(playerKey => {
    const enemy = GamePlayers[playerKey]
    const projectile = playerObject.weapon

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      bullet.kill()
      socket.emit('hitPlayer', playerKey, projectile.damage)
    })
  })
}

export default playerCollision
