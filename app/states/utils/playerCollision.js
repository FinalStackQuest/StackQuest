/* global StackQuest */

import Loot from 'APP/app/classes/Loot'
import Game from 'APP/app/classes/Game'

const playerCollision = (playerObject) => {
  Object.keys(Game.GamePlayers).forEach(playerKey => {
    const enemy = Game.GamePlayers[playerKey]
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
        if(enemy.stats.hp < 0) {
          playerObject.pvpCount ++
          playerObject.HUD.updateCount()
        }
      }
    })

    //  special weapon
    StackQuest.game.physics.arcade.overlap(special.bullets, enemy, (target, bullet) => {
      //  check if same class/faction
      if (projectile.player.key !== enemy.key) {
        let damageTaken = special.damage() - (enemy.stats.defense + enemy.armor.defense)
        if (damageTaken < 1) damageTaken = 1
        const damageText = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, damageTaken, { font: '32px Times New Roman', fill: '#ffa500' })
        setTimeout(() => damageText.destroy(), 500)
        if(enemy.stats.hp < 0) {
          playerObject.pvpCount ++
          playerObject.HUD.updateCount()
        }
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy.weapon.bullets, playerObject, (target, bullet) => {
      if (playerObject.key !== enemy.key) {
        bullet.kill()
        playerObject.takeDamage(enemy.weapon.damage(), enemy.socketId)
      }
    })

    StackQuest.game.physics.arcade.overlap(enemy.special.bullets, playerObject, (target, bullet) => {
      if (playerObject.key !== enemy.key) {
        playerObject.takeDamage(enemy.special.damage(), enemy.socketId)
      }
    })
  })
}

export default playerCollision
