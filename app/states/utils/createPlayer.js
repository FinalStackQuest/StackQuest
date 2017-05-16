import Player from '../../classes/Player'
import HUD from '../../classes/HUD'

/* global StackQuest */

const createPlayer = (player) => {
  let playerObject
  if (!player.class) {
    player.class = 'newbie'
    playerObject = new Player(StackQuest.game, player.userName, player)
  } else {
    playerObject = new Player(StackQuest.game, player.userName, player)
    StackQuest.game.camera.follow(playerObject)
    playerObject.HUD = new HUD(StackQuest.game, playerObject)
  }
  StackQuest.game.camera.follow(playerObject)
  return playerObject
}

export default createPlayer
