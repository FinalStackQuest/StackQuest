import socketio from 'socket.io-client'
import Enemy from './constructor/Enemy'
import {localState} from './states/fantasyState'

export const socket = socketio.connect()
export const GamePlayers = {}
export const GameEnemies = {}

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
  socket.on('enemyCreated', enemyCreated)
  socket.on('foundPath', foundPath)
  socket.on('sendEnemies', sendEnemies)
}

const getPlayers = players => {
  for (const player in GamePlayers) delete GamePlayers[player]
  Object.keys(players).forEach(playerSocketId => {
    const xPos = players[playerSocketId].x
    const yPos = players[playerSocketId].y
    const playerClass = players[playerSocketId].class
    GamePlayers[playerSocketId] = StackQuest.game.add.text(xPos, yPos, playerClass, { font: '32px Arial', fill: '#ffffff' })
    GamePlayers[playerSocketId].anchor.setTo(0.5, 0.5)
  })
}

const addPlayer = (socketId, player) => {
  GamePlayers[socketId] = StackQuest.game.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })
}

const updatePlayer = (socketId, playerPos) => {
  GamePlayers[socketId].position.x = playerPos.x
  GamePlayers[socketId].position.y = playerPos.y
}

const removePlayer = socketId => {
  const player = GamePlayers[socketId]
  if (player) {
    player.destroy()
    delete GamePlayers[socketId]
  }
}
//
const enemyCreated = (enemy) => {
  console.log(1, enemy)
  localState.enemies[enemy.name] = new Enemy(StackQuest.game, enemy.name, {x: enemy.x, y: enemy.y}, enemy.key)
}

const foundPath = ({path, name}) => {
  localState.enemies[name].move(path, localState.state)
}

const sendEnemies = enemies => {
  Object.keys(enemies).forEach(enemyName => {
    const enemy = enemies[enemyName]
    if (!localState.enemies[enemy.name]) {
      localState.enemies[enemy.name] = new Enemy(StackQuest.game, enemy.name, {x: +enemy.x, y: +enemy.y}, enemy.key)
    }
  })
}

socketFunctions(socket)

export default socketFunctions
