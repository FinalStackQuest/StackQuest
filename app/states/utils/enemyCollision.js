/* global StackQuest */

import { socket } from 'APP/app/sockets'
import Game from 'APP/app/classes/Game'

const enemyCollision = (playerObject, graveyard) => {
  Object.keys(Game.GameEnemies).forEach(enemyKey => {
    const enemy = Game.GameEnemies[enemyKey]
    const projectile = playerObject.weapon
    const special = playerObject.special

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      bullet.kill()
      enemy.takeDamage(projectile.damage())

      if (enemy.stats.hp <= 0) {
        graveyard.push(enemy)
        playerObject.killCount++
        playerObject.HUD.updateCount()
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: playerObject.lootCount, killCount: playerObject.killCount })
        delete Game.GameEnemies[enemyKey]
      }
    })

    StackQuest.game.physics.arcade.overlap(special.bullets, enemy, (target, bullet) => {
      enemy.takeDamage(special.damage())

      if (enemy.stats.hp <= 0) {
        graveyard.push(enemy)
        playerObject.killCount++
        playerObject.HUD.updateCount()
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: playerObject.lootCount, killCount: playerObject.killCount })
        delete Game.GameEnemies[enemyKey]
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
      playerObject.takeDamage(enemy.attack())
    })
  })
}

export default enemyCollision
