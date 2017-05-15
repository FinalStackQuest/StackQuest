import { GameItems } from 'APP/app/sockets'

/* global StackQuest */

const itemCollision = (playerObject, itemGraveyard) => {
  Object.keys(GameItems).forEach(itemKey => {
    const item = GameItems[itemKey]
    StackQuest.game.physics.arcade.collide(playerObject, item, (player, item) => {
      playerObject.pickUpItem(item.type)
      itemGraveyard.push(item)
      delete GameItems[itemKey]
    })
  })
}

export default itemCollision
