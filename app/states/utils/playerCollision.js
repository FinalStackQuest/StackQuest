/* global StackQuest */

import { GamePlayers, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const playerCollision = (playerObject) => {
  Object.keys(GamePlayers).forEach(playerKey => {
    const enemy = GamePlayers[playerKey]
    const projectile = playerObject.weapon

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      bullet.kill()
      let damageTaken = projectile.damage() - (enemy.stats.defense + enemy.armor.defense)
      if (damageTaken < 0) damageTaken = 0
      const damageText = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, damageTaken, { font: '32px Times New Roman', fill: '#ffa500' })
      setTimeout(() => damageText.destroy(), 500)
    })
    StackQuest.game.physics.arcade.overlap(enemy.weapon.bullets, playerObject, (target, bullet) => {
      bullet.kill()
      playerObject.takeDamage(enemy.weapon.damage())
    })
  })
}

export default playerCollision
