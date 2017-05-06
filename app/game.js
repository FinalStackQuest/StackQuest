require('pixi')
require('p2')
export const Phaser = require('phaser')
import socketio from 'socket.io-client'
import socketFunctions from './sockets'

export const socket = socketio.connect()

socketFunctions(socket)

// import testState from './states/testState'
import testStateOne from './states/testStateOne'
import testStateTwo from './states/testStateTwo'

// Initialize game
export const StackQuest = new Phaser.Game(1280, 720, Phaser.AUTO, 'game_container')

// Add all the states
StackQuest.state.add('testStateOne', testStateOne)
StackQuest.state.add('testStateTwo', testStateTwo)

// Start StackQuest Game
export const startGame = () =>
  StackQuest.state.start('testStateOne')
