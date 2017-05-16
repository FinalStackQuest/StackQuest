/* global StackQuest */

import { GamePlayers } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const playerCollision = (playerObject) => {
  Object.keys(GamePlayers).forEach(playerKey => {
    const enemy = GamePlayers[playerKey]
    const projectile = playerObject.weapon
    const special = playerObject.special

    //  regular weapon
    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {

      //  check if same class/faction
      if (projectile.player.key !== enemy.key) {
        bullet.kill()
        let damageTaken = projectile.damage() - (enemy.stats.defense + enemy.armor.defense)
        if (damageTaken < 0) damageTaken = 0
        const damageText = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, damageTaken, { font: '32px Times New Roman', fill: '#ffa500' })
        setTimeout(() => damageText.destroy(), 500)
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy.weapon.bullets, playerObject, (target, bullet) => {
      if (playerObject.key !== enemy.key) {
        bullet.kill()
        playerObject.takeDamage(enemy.weapon.damage())
      }
    })

    //  special weapon
    StackQuest.game.physics.arcade.overlap(special.bullets, enemy, (target, bullet) => {
       //  check if same class/faction
      if (projectile.player.key !== enemy.key) {
        let damageTaken = special.damage() - (enemy.stats.defense + enemy.armor.defense)
        if (damageTaken < 0) damageTaken = 0
        const damageText = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, damageTaken, { font: '32px Times New Roman', fill: '#ffa500' })
        setTimeout(() => damageText.destroy(), 500)
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy.special.bullets, playerObject, (target, bullet) => {
      // bullet.kill()
      if (playerObject.key !== enemy.key) {
        playerObject.takeDamage(enemy.special.damage())
      }
    })
  })
}

export default playerCollision
