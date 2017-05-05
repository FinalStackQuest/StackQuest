import StackQuest from '../main'

let cursors, AGuy, BGuy, ZGuy
const mapState = {
  init: function(x, y) {
    if (!x && !y) return
    console.log('x', x)
    console.log('y', y)
    ZGuy = this.add.text(x, y, 'Z', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
  },
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
    // console.log('A Guy Stuff initial', AGuy)
  },
  update: function() {
    // console.log('A Guy Stuff', AGuy)
    if (AGuy.body.blocked.up || AGuy.body.blocked.down || AGuy.body.blocked.left || AGuy.body.blocked.right){
      this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y)
    }
    if (this.physics.arcade.collide(AGuy, BGuy)) {
      this.state.start('anotherMapState')
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
    this.game.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default mapState
