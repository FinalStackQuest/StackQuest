/* global StackQuest */

import { GameEnemies, GameItems, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const enemyCollision = (playerObject, graveyard) => {
  Object.keys(GameEnemies).forEach(enemyKey => {
    const enemy = GameEnemies[enemyKey]
    const projectile = playerObject.getProjectile()

    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      const didDie = enemy.takeDamage(projectile.damage)
      bullet.kill()
      const damage = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, projectile.damage, { font: '32px Times New Roman', fill: '#ffa500' })
      setTimeout(() => damage.destroy(), 500)

      if (didDie) {
        const newItemName = Math.random().toString(36).substr(2, 5) // need this in order to create a random item name
        GameItems[newItemName] = new Loot(StackQuest.game, newItemName, { x: enemy.x, y: enemy.y }, 'item')
        const newItem = GameItems[newItemName]
        socket.emit('createItem', { itemPos: newItem.position, name: newItem.name, key: newItem.key })
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
