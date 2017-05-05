import StackQuest from '../main'

let cursors, CGuy, DGuy, ZGuy
const anotherMapState = {
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
    CGuy = this.add.text(200, 200, 'C', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.enable(CGuy, Phaser.Physics.ARCADE)
    CGuy.body.collideWorldBounds = true
    this.camera.follow(CGuy)
    // Transportation
    DGuy = this.add.text(400, 400, 'D', { font: '32px Arial', fill: '#f27c4f', align: 'center' })
    StackQuest.physics.enable(DGuy, Phaser.Physics.ARCADE)
    console.log('A Guy Stuff', CGuy)
  },
  update: function() {
    if (CGuy.body.blocked.up || CGuy.body.blocked.down || CGuy.body.blocked.left || CGuy.body.blocked.right){
      this.state.start('mapState', true, false, CGuy.position.x, CGuy.position.y)
    }
    if (this.physics.arcade.collide(CGuy, DGuy)) {
      this.state.start('mapState')
    }
    if (cursors.up.isDown) {
      CGuy.position.y -= 2
    } else if (cursors.down.isDown) {
      CGuy.position.y += 2
    } if (cursors.left.isDown) {
      CGuy.position.x -= 2
    } else if (cursors.right.isDown) {
      CGuy.position.x += 2
    }
  },
  render: function() {
    this.game.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default anotherMapState
