import StackQuest from '../main'

let cursors, AGuy, BGuy
const mapState = {
  preload: function() {

  },
  create: function() {
    this.world.setBounds(0, 0, 1920, 1080)

    // Mover
    AGuy = this.add.text(200, 200, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.enable(AGuy, Phaser.Physics.ARCADE)
    AGuy.body.collideWorldBounds = true
    this.camera.follow(AGuy)
    // Transportation
    BGuy = this.add.text(400, 400, 'B', { font: '32px Arial', fill: '#f27c4f', align: 'center' })
    StackQuest.physics.enable(BGuy, Phaser.Physics.ARCADE)
    console.log('A Guy Stuff', AGuy)
  },
  update: function() {
    if (this.physics.arcade.collide(AGuy, BGuy)) {
      this.state.start('testState')
    }
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
