import Game from 'APP/app/classes/Game'

/* global StackQuest */

const itemCollision = (playerObject, itemGraveyard) => {
  Object.keys(Game.GameItems).forEach(itemKey => {
    const item = Game.GameItems[itemKey]
    StackQuest.game.physics.arcade.collide(playerObject, item, (player, item) => {
      playerObject.pickUpItem(item.type)
      itemGraveyard.push(item)
      delete Game.GameItems[itemKey]
    })
  })
}

export default itemCollision
