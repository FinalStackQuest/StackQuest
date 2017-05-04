require('pixi')
require('p2')
const Phaser = require('phaser')

import testState from './states/testState'

// Initialize game
var StackQuest = new Phaser.Game(1280, 720, Phaser.AUTO, 'main')

// Add all the states
StackQuest.state.add('testState', testState)

// Start StackQuest Game
StackQuest.state.start('testState')

export default StackQuest
