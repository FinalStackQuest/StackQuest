import Player from '../../constructor/Player-temp'

const createPlayer = (player) => {
  const playerObject = new Player(StackQuest.game, 'player1', player, player.class)
  StackQuest.game.camera.follow(playerObject)
  return playerObject
}

export default createPlayer
