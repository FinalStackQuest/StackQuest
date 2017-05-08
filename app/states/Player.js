// import { Phaser } from '../main.js'
// console.log('phaser', Phaser)
// const Group = Phaser.Group

const Player = {
  Player: function(bodyImage, weaponImage) {
    this.addChild(bodyImage)
    this.addChild(weaponImage)
  }
}

export default Player
