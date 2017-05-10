const createPlayer = (player) => {
  const playerObject = StackQuest.game.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })

  StackQuest.game.physics.enable(playerObject)

  playerObject.anchor.setTo(0.5, 0.5)
  playerObject.body.allowRotation = false

  StackQuest.game.camera.follow(playerObject)

  return playerObject
}

export default createPlayer
