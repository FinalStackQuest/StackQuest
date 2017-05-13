/* global StackQuest */

import { GameEnemies, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const enemyCollision = (playerObject, projectile, graveyard, lootState) => {
  Object.keys(GameEnemies).forEach(enemyKey => {
    const enemy = GameEnemies[enemyKey]
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
      console.log('playerObj is gonna get hurt:', playerObject)
      playerObject.takeDamage(enemy.attack())

      if (playerObject.stats.hp <= 0) {
        playerObject.respawn()
        // playerObject.position.x = 500
        // playerObject.position.y = 500
        //  reset internal health: TEMP
        // playerObject.stats.hp = 100
        // const damage = StackQuest.game.add.text(playerObject.position.x, playerObject.position.y, 'YOU DIED', { font: '32px Times New Roman', fill: '#ff0000' })
        // setTimeout(() => damage.destroy(), 1000)
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: 0 })
      }
    })
  })
}

export default enemyCollision
