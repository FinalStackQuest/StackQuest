import { socket, GameItems } from 'APP/app/sockets'

/* global StackQuest */

const itemCollision = (playerObject, itemGraveyard) => {
  Object.keys(GameItems).forEach(itemKey => {
    const item = GameItems[itemKey]
    StackQuest.game.physics.arcade.collide(playerObject, item, (player, item) => {
      if (item.type === 'loot') {
        playerObject.lootCount++
        const lootCount = StackQuest.game.add.text(player.x, player.y + 20, 'Loot acquired ' + playerObject.lootCount, { font: '22px Times New Roman', fill: '#ffffff' })
        setTimeout(() => { lootCount.destroy() }, 3000)
      } else if (item.type === 'weapon') {
        const weaponNotice = StackQuest.game.add.text(player.x, player.y + 20, 'Weapon acquired, Attack + 1! ', { font: '22px Times New Roman', fill: '#ffffff' })
        playerObject.getProjectile().damage++
        setTimeout(() => { weaponNotice.destroy() }, 3000)
      } else {
        const armorNotice = StackQuest.game.add.text(player.x, player.y + 20, 'Armor acquired, Defense + 1! ', { font: '22px Times New Roman', fill: '#ffffff' })
        playerObject.stats.defense++
        setTimeout(() => { armorNotice.destroy() }, 3000)
      }
      itemGraveyard.push(item)
      delete GameItems[itemKey]
      socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: playerObject.lootCount })
    })
  })
}

export default itemCollision
