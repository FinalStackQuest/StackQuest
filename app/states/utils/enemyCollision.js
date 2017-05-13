/* global StackQuest */

import { GameEnemies, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const enemyCollision = (playerObject, graveyard, lootState) => {
  Object.keys(GameEnemies).forEach(enemyKey => {
    const enemy = GameEnemies[enemyKey]
    const projectile = playerObject.getProjectile()

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      const didDie = enemy.takeDamage(projectile.damage)
      bullet.kill()
      const damage = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, projectile.damage, { font: '32px Times New Roman', fill: '#ffa500' })
      setTimeout(() => damage.destroy(), 500)

      if (didDie) {
        lootState.push(new Loot(StackQuest.game, 'Item', { x: enemy.x, y: enemy.y }, 'item'))
        graveyard.push(enemy)
        delete GameEnemies[enemyKey]
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
      playerObject.takeDamage(enemy.attack())

      if (playerObject.stats.hp <= 0) {
        playerObject.respawn()
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: 0 })
      }
    })
  })
}

export default enemyCollision
