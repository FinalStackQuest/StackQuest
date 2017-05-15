import { socket, GameItems } from 'APP/app/sockets'

/* global StackQuest */

const itemCollision = (playerObject, itemGraveyard) => {
  Object.keys(GameItems).forEach(itemKey => {
    const item = GameItems[itemKey]
    StackQuest.game.physics.arcade.collide(playerObject, item, (player, item) => {
      playerObject.pickUpItem(item.type)
      itemGraveyard.push(item)
      delete GameItems[itemKey]
      socket.emit('updateStats', playerObject.stats)
      socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: playerObject.lootCount })
    })
  })
}

export default itemCollision
