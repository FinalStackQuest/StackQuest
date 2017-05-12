const playerAttack = (pointer, mouseEvent, playerObject, projectile) => {
  projectile.fire(null, StackQuest.game.input.worldX, StackQuest.game.input.worldY)
}

export default playerAttack
