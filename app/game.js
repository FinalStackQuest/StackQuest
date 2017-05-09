require('pixi')
require('p2')
require('phaser')

import loadingScreen from './states/loadingScreen'
import preloadTest from './states/preloadTest'
// preloadTest is a clone of fantasyState to test loadingScreen state
import fantasyState from './states/fantasyState'
import spaceState from './states/spaceState'

class StackQuest extends Phaser.Game {
  // Initialize game
  constructor() {
    super(1280, 720, Phaser.AUTO, 'game-container')// Add all the states
    this.state.add('loadingScreen', loadingScreen)
    this.state.add('preloadTest', preloadTest)
    this.state.add('fantasyState', fantasyState)
    this.state.add('spaceState', spaceState)
  }

  startGame(character) {
    // Start StackQuest Game
    this.state.start(character.currentMap, true, false, character)
  }
}

export default StackQuest
