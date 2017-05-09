import { socket } from 'APP/app/sockets'

const mapTransition = (player, playerObject, nextMap) => {
  if (playerObject.position.y <= StackQuest.game.world.bounds.top + playerObject.height) {
    player.x = playerObject.position.x
    player.y = StackQuest.game.world.bounds.bottom - playerObject.height - 10
    player.currentMap = nextMap
    StackQuest.game.state.start(player.currentMap, true, false, player)
  } else if (playerObject.position.y >= StackQuest.game.world.bounds.bottom - playerObject.height) {
    player.x = playerObject.position.x
    player.y = StackQuest.game.world.bounds.top + playerObject.height + 10
    player.currentMap = nextMap
    StackQuest.game.state.start(player.currentMap, true, false, player)
  } else if (playerObject.position.x <= StackQuest.game.world.bounds.left + playerObject.width) {
    player.x = StackQuest.game.world.bounds.right - playerObject.width - 10
    player.y = playerObject.position.y
    player.currentMap = nextMap
    StackQuest.game.state.start(player.currentMap, true, false, player)
  } else if (playerObject.position.x >= StackQuest.game.world.bounds.right - playerObject.width) {
    player.x = StackQuest.game.world.bounds.left + playerObject.width + 10
    player.y = playerObject.position.y
    player.currentMap = nextMap
    StackQuest.game.state.start(player.currentMap, true, false, player)
  }
}

export default mapTransition
