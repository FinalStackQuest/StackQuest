import socketio from 'socket.io-client'
import Enemy from './classes/Enemy'
import Player from './classes/Player'

/* global StackQuest */

export const socket = socketio.connect()
export const GamePlayers = {}
export const GameEnemies = {}

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
  socket.on('fireProjectile', fireProjectile)
  socket.on('getEnemies', getEnemies)
  socket.on('addEnemy', addEnemy)
  socket.on('updateEnemy', updateEnemy)
  socket.on('removeEnemy', removeEnemy)
}

const getPlayers = players => {
  for (const player in GamePlayers) delete GamePlayers[player]
  Object.keys(players).forEach(playerSocketId => {
    GamePlayers[playerSocketId] = new Player(StackQuest.game, players[playerSocketId].userName, players[playerSocketId])
  })
}

const addPlayer = (socketId, player) => {
  GamePlayers[socketId] = new Player(StackQuest.game, player.userName, player)
}

const updatePlayer = (socketId, player) => {
  GamePlayers[socketId].moveOther(player.playerPos.x, player.playerPos.y)
}

const removePlayer = socketId => {
  if (GamePlayers[socketId]) GamePlayers[socketId].destroy()
  delete GamePlayers[socketId]
}

const fireProjectile = (socketId, xCoord, yCoord) => {
  if (GamePlayers[socketId]) {
    GamePlayers[socketId].projectile.fire(null, xCoord, yCoord)
  }
}

const getEnemies = enemies => {
  for (const enemy in GameEnemies) delete GameEnemies[enemy]
  Object.keys(enemies).forEach(enemyName => {
    const enemy = enemies[enemyName]
    GameEnemies[enemyName] = new Enemy(StackQuest.game, enemyName, { x: enemy.x, y: enemy.y }, enemy.key)
  })
}

const addEnemy = enemy => {
  GameEnemies[enemy.name] = new Enemy(StackQuest.game, enemy.name, { x: enemy.x, y: enemy.y }, enemy.key)
}

const updateEnemy = (newPos, name) => {
  if (GameEnemies[name]) GameEnemies[name].move(newPos)
}

const removeEnemy = enemyName => {
  if (GameEnemies[enemyName]) {
    GameEnemies[enemyName].enemyHealthBar.kill()
    GameEnemies[enemyName].destroy()
  }
  delete GameEnemies[enemyName]
}

socketFunctions(socket)

export default socketFunctions
