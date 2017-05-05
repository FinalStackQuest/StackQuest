import StackQuest from '../main'

let cursors, CGuy, DGuy, ZGuy
const anotherMapState = {
  init: function(x, y) {
    this.world.setBounds(0, 0, 1920, 1080)
    this.physics.startSystem(Phaser.Physics.P2JS)
    if (!x && !y) return
    // ZGuy = this.add.text(x, y, 'Z', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    CGuy = this.add.text(x, y, 'C', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.p2.enable(CGuy)
    CGuy.body.collideWorldBounds = true
    this.physics.p2.updateBoundsCollisionGroup()
  },
  preload: function() {

  },
  create: function() {
    // Mover
    if (!CGuy) {
      CGuy = this.add.text(200, 200, 'C', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
      cursors = this.input.keyboard.createCursorKeys()
      this.physics.p2.enable(CGuy)
      CGuy.body.collideWorldBounds = true
      this.physics.p2.updateBoundsCollisionGroup()
      this.camera.follow(CGuy)
    }
    this.camera.follow(CGuy)
    // Transportation
    DGuy = this.add.text(400, 400, 'D', { font: '32px Arial', fill: '#f27c4f', align: 'center' })
    this.physics.p2.enable(DGuy)
    // console.log('A Guy Stuff initial', CGuy)
  },
  update: function() {
    // console.log('A Guy Stuff', CGuy)
    // if (CGuy.body.blocked.up || CGuy.body.blocked.down || CGuy.body.blocked.left || CGuy.body.blocked.right) {
    //   this.state.start('mapState', true, false, CGuy.position.x, CGuy.position.y)
    // }
    if (CGuy.position.y <= this.world.bounds.top) {
      this.state.start('mapState', true, false, CGuy.position.x, this.world.bounds.bottom - 20)
    }
    if (CGuy.position.x <= this.world.bounds.left) {
      this.state.start('mapState', true, false, this.world.bounds.right - 20, CGuy.position.y)
    }
    if (CGuy.position.y >= this.world.bounds.bottom) {
      this.state.start('mapState', true, false, CGuy.position.x, this.world.bounds.top + 20)
    }
    if (CGuy.position.x >= this.world.bounds.right) {
      this.state.start('mapState', true, false, this.world.bounds.left + 20, CGuy.position.y)
    }
    // if (CGuy.body.blocked.up) this.state.start('mapState', true, false, CGuy.position.x, CGuy.position.y + 5)
    if (this.physics.arcade.collide(CGuy, DGuy)) {
      this.state.start('mapState')
    }
    CGuy.body.setZeroVelocity()
    if (cursors.up.isDown) {
      CGuy.body.moveUp(200)
    } else if (cursors.down.isDown) {
      CGuy.body.moveDown(200)
    } if (cursors.left.isDown) {
      CGuy.body.moveLeft(200)
    } else if (cursors.right.isDown) {
      CGuy.body.moveRight(200)
    }
  },
  render: function() {
    this.game.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default anotherMapState
