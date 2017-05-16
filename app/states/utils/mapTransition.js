import { socket } from 'APP/app/sockets'

/* global StackQuest */

const savePlayerState = (player, playerObject, nextMap) => {
  player.currentMap = nextMap
  player.hp = playerObject.stats.hp
  socket.emit('savePlayer', player)
  StackQuest.game.state.start(player.currentMap, true, false, player)
}

const mapTransition = (player, playerObject, nextMap) => {
  if (playerObject.position.y <= StackQuest.game.world.bounds.top + playerObject.height) {
    player.x = playerObject.position.x
    player.y = StackQuest.game.world.bounds.bottom - playerObject.height - 10
    if (playerObject.position.x < StackQuest.game.world.bounds.right / 2) {
      savePlayerState(player, playerObject, 'fantasyState')
    } else {
      savePlayerState(player, playerObject, 'spaceState')
    }
  } else if (playerObject.position.y >= StackQuest.game.world.bounds.bottom - playerObject.height) {
    player.x = playerObject.position.x
    player.y = StackQuest.game.world.bounds.top + playerObject.height + 10
    savePlayerState(player, playerObject, 'arenaState')
  } else if (playerObject.position.x <= StackQuest.game.world.bounds.left + playerObject.width) {
    player.x = StackQuest.game.world.bounds.right - playerObject.width - 10
    player.y = playerObject.position.y
    savePlayerState(player, playerObject, 'fantasyState')
  } else if (playerObject.position.x >= StackQuest.game.world.bounds.right - playerObject.width) {
    player.x = StackQuest.game.world.bounds.left + playerObject.width + 10
    player.y = playerObject.position.y
    savePlayerState(player, playerObject, 'spaceState')
  }
}

export default mapTransition
