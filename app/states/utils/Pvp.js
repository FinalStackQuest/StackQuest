/* global StackQuest */

import { GamePlayers, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const Pvp = (playerObject) => {
  Object.keys(GamePlayers).forEach(playerKey => {
    const enemy = GamePlayers[playerKey]
    const projectile = playerObject.getProjectile()

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      const didDie = enemy.takeDamage(projectile.damage)
      bullet.kill()
      const damage = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, projectile.damage, { font: '32px Times New Roman', fill: '#ffa500' })
      setTimeout(() => damage.destroy(), 500)

      if (didDie) {
        enemy.respawn()
        socket.emit('updatePlayer', { playerPos: enemy.position, lootCount: 0 })
      }
    })
  })
}

export default Pvp
