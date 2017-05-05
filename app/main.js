require('pixi')
require('p2')
const Phaser = require('phaser')

// import testState from './states/testState'
import testState from './states/testMulti'
import mapState from './states/mapState'
import anotherMapState from './states/anotherMapState'

// Initialize game
var StackQuest = new Phaser.Game(1280, 720, Phaser.AUTO, 'main')

// Add all the states
StackQuest.state.add('testState', testState)
StackQuest.state.add('mapState', mapState)
StackQuest.state.add('anotherMapState', anotherMapState)
// Start StackQuest Game
// StackQuest.state.start('testState')
StackQuest.state.start('mapState')

export default StackQuest
