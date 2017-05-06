require('pixi')
require('p2')
const Phaser = require('phaser')

// import testState from './states/testState'
import testStateOne from './states/testStateOne'
import testStateTwo from './states/testStateTwo'
import mapState from './states/mapState'
import anotherMapState from './states/anotherMapState'

// Initialize game
var StackQuest = new Phaser.Game(1280, 720, Phaser.AUTO, 'main')

// Add all the states
StackQuest.state.add('testStateOne', testStateOne)
StackQuest.state.add('testStateTwo', testStateTwo)
StackQuest.state.add('mapState', mapState)
StackQuest.state.add('anotherMapState', anotherMapState)

// Start StackQuest Game
StackQuest.state.start('testStateOne')

export default StackQuest
