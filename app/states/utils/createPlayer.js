import Player from '../../classes/Player'
/* global StackQuest */

const createPlayer = (player) => {
  const playerObject = new Player(StackQuest.game, 'player1', player)
  StackQuest.game.camera.follow(playerObject)
  console.log(player)
  return playerObject
}

export default createPlayer
