import StackQuest from '../main'

let cursors, AGuy
const mapState = {
  preload: function() {

  },
  create: function() {
    this.world.setBounds(0, 0, 1920, 1080)

    AGuy = this.add.text(200, 200, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.enable(AGuy, Phaser.Physics.ARCADE)
    // hi
    AGuy.body.collideWorldBounds = true
    console.log('A Guy Stuff', AGuy)
  },
  update: function() {
    this.physics.arcade.collide(AGuy)
    if (cursors.up.isDown) {
      AGuy.position.y -= 2
    } else if (cursors.down.isDown) {
      AGuy.position.y += 2
    } if (cursors.left.isDown) {
      AGuy.position.x -= 2
    } else if (cursors.right.isDown) {
      AGuy.position.x += 2
    }
  },
  render: function() {
    StackQuest.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default mapState
