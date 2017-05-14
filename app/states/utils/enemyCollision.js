/* global StackQuest */

import { GameEnemies, socket } from 'APP/app/sockets'

const enemyCollision = (playerObject, graveyard) => {
  Object.keys(GameEnemies).forEach(enemyKey => {
    const enemy = GameEnemies[enemyKey]
    const projectile = playerObject.weapon

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      bullet.kill()
      enemy.takeDamage(projectile.damage())

      if (enemy.stats.hp <= 0) {
        graveyard.push(enemy)
        delete GameEnemies[enemyKey]
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
      playerObject.takeDamage(enemy.attack())
    })
  })
}

export default enemyCollision
