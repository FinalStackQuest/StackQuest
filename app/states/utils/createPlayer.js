import Player from '../../classes/Player'
import HUD from '../../classes/HUD'
import Game from '../../classes/Game'

/* global StackQuest */

let player

const createPlayer = (player) => {
  let playerObject
  if (!player.class) {
    player.class = 'newbie'
    playerObject = new Player(StackQuest.game, player.userName, player, Game.currentPlayerId)
  } else {
    playerObject = new Player(StackQuest.game, player.userName, player, Game.currentPlayerId)
    playerObject.HUD = new HUD(StackQuest.game, playerObject)
  }
  Game.currentPlayer = playerObject
  StackQuest.game.camera.follow(playerObject)
  console.log(Game)
  return playerObject
}

export default createPlayer
