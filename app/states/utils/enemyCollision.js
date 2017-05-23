/* global StackQuest */

import { socket } from 'APP/app/sockets'
import Game from 'APP/app/classes/Game'

const enemyCollision = (playerObject, graveyard) => {
  Object.keys(Game.enemies).forEach(enemyKey => {
    const enemy = Game.enemies[enemyKey]
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
        delete Game.enemies[enemyKey]
      }
    })

    StackQuest.game.physics.arcade.overlap(special.bullets, enemy, (target, bullet) => {
      enemy.takeDamage(special.damage())

      if (enemy.stats.hp <= 0) {
        graveyard.push(enemy)
        playerObject.killCount++
        playerObject.HUD.updateCount()
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: playerObject.lootCount, killCount: playerObject.killCount })
        delete Game.enemies[enemyKey]
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
      playerObject.takeDamage(enemy.attack())
    })
  })
}

export default enemyCollision
