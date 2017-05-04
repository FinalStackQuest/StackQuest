import StackQuest from '../main'

let cursors
  , cameraText
  , fixedText

const testState = {
  preload() {

  },

  create() {
    //  Modify the world and camera bounds
    StackQuest.world.setBounds(0, 0, 1920, 1080)

    cameraText = StackQuest.add.text(StackQuest.world.width / 2, StackQuest.world.height / 2, 'X', { font: '32px Arial', fill: '#f26c4f', align: 'center' })

    fixedText = StackQuest.add.text(0, 0, 'O', { font: '32px Arial', fill: '#ffffff', align: 'center' })
    fixedText.fixedToCamera = true
    fixedText.cameraOffset.setTo(StackQuest.width / 2, StackQuest.height / 2)

    cursors = StackQuest.input.keyboard.createCursorKeys()

    StackQuest.physics.enable(cameraText, Phaser.Physics.ARCADE)
    StackQuest.physics.enable(fixedText, Phaser.Physics.ARCADE)
  },

  update() {
    if (cursors.up.isDown) {
      if (StackQuest.physics.arcade.collide(cameraText, fixedText)) StackQuest.camera.y += 4
      else StackQuest.camera.y -= 4
    } else if (cursors.down.isDown) {
      if (StackQuest.physics.arcade.collide(cameraText, fixedText)) StackQuest.camera.y -= 4
      else StackQuest.camera.y += 4
    } if (cursors.left.isDown) {
      if (StackQuest.physics.arcade.collide(cameraText, fixedText)) StackQuest.camera.x += 4
      else StackQuest.camera.x -= 4
    } else if (cursors.right.isDown) {
      if (StackQuest.physics.arcade.collide(cameraText, fixedText)) StackQuest.camera.x -= 4
      else StackQuest.camera.x += 4
    }
  },

  render() {
    StackQuest.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default testState
