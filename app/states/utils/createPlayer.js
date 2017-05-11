const createPlayer = (player) => {
  console.log('checking stats', player)
  let playerObject
  //  load correct sprite
  if (player.class === 'wizard') {
    player.stats = {
      attack: 8,
      defense: 7
    }
    playerObject = StackQuest.game.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })
  } else {
    //  cyborg
    player.stats = {
      attack: 7,
      defense: 6
    }
    playerObject = StackQuest.game.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })
  }

  StackQuest.game.physics.enable(playerObject)

  playerObject.anchor.setTo(0.5, 0.5)
  playerObject.body.allowRotation = false
  playerObject.internalStats = player
  // console.log('checking stats:', playerObject.internalStats)

  StackQuest.game.camera.follow(playerObject)

  return playerObject
}

export default createPlayer
