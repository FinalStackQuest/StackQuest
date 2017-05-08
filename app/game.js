require('./sockets')
require('pixi')
require('p2')
export const Phaser = require('phaser')

import testStateOne from './states/testStateOne'
import testStateTwo from './states/testStateTwo'

class StackQuest extends Phaser.Game {
  constructor() {
    super(1280, 720, Phaser.AUTO, 'game_container')
    this.state.add('testStateOne', testStateOne)
    this.state.add('testStateTwo', testStateTwo)
  }

  startGame() {
    this.state.start('testStateOne')
  }
}

export default StackQuest
