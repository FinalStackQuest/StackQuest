import StackQuest from '../main'

let cursors, AGuy, BGuy, ZGuy
const mapState = {
  init: function(x, y) {
    this.world.setBounds(0, 0, 1920, 1080)
    this.physics.startSystem(Phaser.Physics.P2JS)
    if (!x && !y) return
    // ZGuy = this.add.text(x, y, 'Z', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    AGuy = this.add.text(x, y, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
    cursors = this.input.keyboard.createCursorKeys()
    this.physics.p2.enable(AGuy)
    AGuy.body.collideWorldBounds = true
    this.physics.p2.updateBoundsCollisionGroup()
  },
  preload: function() {

  },
  create: function() {
    // Mover
    if (!AGuy) {
      AGuy = this.add.text(200, 200, 'A', { font: '18px Arial', fill: '#f26c4f', align: 'center' })
      cursors = this.input.keyboard.createCursorKeys()
      this.physics.p2.enable(AGuy)
      AGuy.body.collideWorldBounds = true
      this.physics.p2.updateBoundsCollisionGroup()
      this.camera.follow(AGuy)
    }
    this.camera.follow(AGuy)
    // Transportation
    BGuy = this.add.text(400, 400, 'B', { font: '32px Arial', fill: '#f27c4f', align: 'center' })
    this.physics.p2.enable(BGuy)
    // console.log('A Guy Stuff initial', AGuy)
  },
  update: function() {
    // console.log('A Guy Stuff', AGuy)
    // if (AGuy.body.blocked.up || AGuy.body.blocked.down || AGuy.body.blocked.left || AGuy.body.blocked.right) {
    //   this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y)
    // }

    if (AGuy.position.y <= this.world.bounds.top) {
      this.state.start('anotherMapState', true, false, AGuy.position.x, this.world.bounds.bottom - 20)
    }
    if (AGuy.position.x <= this.world.bounds.left) {
      this.state.start('anotherMapState', true, false, this.world.bounds.right - 20, AGuy.position.y)
    }
    if (AGuy.position.y >= this.world.bounds.bottom) {
      this.state.start('anotherMapState', true, false, AGuy.position.x, this.world.bounds.top + 20)
    }
    if (AGuy.position.x >= this.world.bounds.right) {
      this.state.start('anotherMapState', true, false, this.world.bounds.left + 20, AGuy.position.y)
    }
    // if (AGuy.body.blocked.up) this.state.start('anotherMapState', true, false, AGuy.position.x, AGuy.position.y + 5)
    if (this.physics.arcade.collide(AGuy, BGuy)) {
      this.state.start('anotherMapState')
    }
    AGuy.body.setZeroVelocity()
    if (cursors.up.isDown) {
      AGuy.body.moveUp(200)
    } else if (cursors.down.isDown) {
      AGuy.body.moveDown(200)
    } if (cursors.left.isDown) {
      AGuy.body.moveLeft(200)
    } else if (cursors.right.isDown) {
      AGuy.body.moveRight(200)
    }
  },
  render: function() {
    this.game.debug.cameraInfo(StackQuest.camera, 32, 32)
  }
}

export default mapState
