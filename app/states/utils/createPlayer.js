import Player from '../../classes/Player'
import HUD from '../../classes/HUD'

/* global StackQuest */

const createPlayer = (player) => {
  const playerObject = new Player(StackQuest.game, player.userName, player)
  StackQuest.game.camera.follow(playerObject)
  playerObject.HUD = new HUD(StackQuest.game, playerObject)
  return playerObject
}

export default createPlayer
