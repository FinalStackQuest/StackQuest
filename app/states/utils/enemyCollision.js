/* global StackQuest */

import { GameEnemies, GameItems, socket } from 'APP/app/sockets'
import Loot from 'APP/app/classes/Loot'

const enemyCollision = (playerObject, projectile, graveyard) => {
  Object.keys(GameEnemies).forEach(enemyKey => {
    const enemy = GameEnemies[enemyKey]
    StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, (target, bullet) => {
      const didDie = enemy.takeDamage(projectile.damage)
      bullet.kill()
      const damage = StackQuest.game.add.text(enemy.x + Math.random() * 20, enemy.y + Math.random() * 20, projectile.damage, { font: '32px Times New Roman', fill: '#ffa500' })
      setTimeout(() => damage.destroy(), 500)

      if (didDie) {
        const newItemName = Math.random().toString(36).substr(2, 5) // need this in order to create a random item name
        GameItems[newItemName] = new Loot(StackQuest.game, newItemName, { x: enemy.x, y: enemy.y }, 'item')
        const newItem = GameItems[newItemName]
        socket.emit('createItem', {itemPos: newItem.position, name: newItem.name, key: newItem.key})
        graveyard.push(enemy)
        delete GameEnemies[enemyKey]
      }
    })
    StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
      playerObject.stats.hp -= enemy.attack()

      if (playerObject.stats.hp <= 0) {
        playerObject.position.x = 500
        playerObject.position.y = 500
        //  reset internal health: TEMP
        playerObject.stats.hp = 100
        const damage = StackQuest.game.add.text(playerObject.position.x, playerObject.position.y, 'YOU DIED', { font: '32px Times New Roman', fill: '#ff0000' })
        setTimeout(() => damage.destroy(), 1000)
        socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: 0 })
      }
    })
  })
}

export default enemyCollision
