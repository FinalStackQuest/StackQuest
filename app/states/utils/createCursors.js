/* global StackQuest, Phaser */

const createCursors = () => {
  const cursors = StackQuest.game.input.keyboard.createCursorKeys()
  cursors.w = StackQuest.game.input.keyboard.addKey(Phaser.Keyboard.W)
  cursors.a = StackQuest.game.input.keyboard.addKey(Phaser.Keyboard.A)
  cursors.s = StackQuest.game.input.keyboard.addKey(Phaser.Keyboard.S)
  cursors.d = StackQuest.game.input.keyboard.addKey(Phaser.Keyboard.D)

  return cursors
}

export default createCursors
