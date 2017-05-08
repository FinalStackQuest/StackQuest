require('pixi')
require('p2')
require('phaser')

import loadingScreen from './states/loadingScreen'
import preloadTest from './states/preloadTest'
// preloadTest is a clone of testStateOne to test loadingScreen state
import testStateOne from './states/testStateOne'
import testStateTwo from './states/testStateTwo'

class StackQuest extends Phaser.Game {
  // Initialize game
  constructor() {
    super(1280, 720, Phaser.AUTO)// Add all the states
    this.state.add('loadingScreen', loadingScreen)
    this.state.add('preloadTest', preloadTest)
    this.state.add('testStateOne', testStateOne)
    this.state.add('testStateTwo', testStateTwo)
  }

  startGame() {
    // Start StackQuest Game
    this.state.start('testStateOne')
  }
}

export default StackQuest
