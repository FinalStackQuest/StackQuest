import Game from 'APP/app/classes/Game'

/* global StackQuest */

const itemCollision = (playerObject, itemGraveyard) => {
  Object.keys(Game.items).forEach(itemKey => {
    const item = Game.items[itemKey]
    StackQuest.game.physics.arcade.collide(playerObject, item, (player, item) => {
      playerObject.pickUpItem(item.type)
      itemGraveyard.push(item)
      delete Game.items[itemKey]
    })
  })
}

export default itemCollision
