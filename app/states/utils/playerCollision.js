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
    StackQuest.game.physics.arcade.overlap(enemy.weapon.bullets, playerObject, (target, bullet) => {
      bullet.kill()
      playerObject.takeDamage(enemy.attack())
      socket.emit('updateStats', playerObject.stats)
      if (playerObject.stats.hp <= 0) {
        playerObject.respawn()
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: 0 })
      }
    })
  })
}

export default playerCollision
