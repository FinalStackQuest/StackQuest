import socketio from 'socket.io-client'
import Enemy from './classes/Enemy'
import Player from './classes/Player'
import Loot from './classes/Loot'

/* global StackQuest */

export const socket = socketio.connect()
export const GamePlayers = {}
export const GameEnemies = {}
export const GameItems = {}
export const GameGroups = {}

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
  socket.on('fireProjectile', fireProjectile)
  socket.on('fireSpecial', fireSpecial)
  socket.on('getEnemies', getEnemies)
  socket.on('addEnemy', addEnemy)
  socket.on('updateEnemy', updateEnemy)
  socket.on('hitEnemy', hitEnemy)
  socket.on('removeEnemy', removeEnemy)
  socket.on('getItems', getItems)
  socket.on('addItem', addItem)
  socket.on('removeItem', removeItem)
  socket.on('updateStats', updateStats)
}

const getPlayers = players => {
  for (const player in GamePlayers) delete GamePlayers[player]
  Object.keys(players).forEach(playerSocketId => {
    addPlayer(playerSocketId, players[playerSocketId])
  })
}

const addPlayer = (socketId, player) => {
  GamePlayers[socketId] = new Player(StackQuest.game, player.userName, player)
}

const updatePlayer = (socketId, player) => {
  GamePlayers[socketId].moveOther(player.playerPos.x, player.playerPos.y)
}

const removePlayer = socketId => {
  if (GamePlayers[socketId]) {
    GamePlayers[socketId].playerHealthBar.kill()
    GamePlayers[socketId].destroy()
  }
  delete GamePlayers[socketId]
}

const updateStats = (socketId, stats) => {
  if (GamePlayers[socketId]) {
    GamePlayers[socketId].stats = stats
    GamePlayers[socketId].computeLifeBar()
  }
}

const fireProjectile = (socketId, xCoord, yCoord) => {
  if (GamePlayers[socketId]) {
    GamePlayers[socketId].weapon.fire(null, xCoord, yCoord)
  }
}

const fireSpecial = (socketId, xCoord, yCoord) => {
  if (GamePlayers[socketId]) {
    GamePlayers[socketId].special.fire(null, xCoord, yCoord)
  }
}

const getEnemies = enemies => {
  for (const enemy in GameEnemies) delete GameEnemies[enemy]
  Object.keys(enemies).forEach(enemyName => {
    addEnemy(enemies[enemyName])
  })
}

const addEnemy = enemy => {
  GameEnemies[enemy.name] = new Enemy(StackQuest.game, enemy.name, { x: enemy.x, y: enemy.y }, enemy.spriteKey, enemy.stats)
}

const updateEnemy = (newPos, name) => {
  if (GameEnemies[name]) GameEnemies[name].move(newPos)
}

const hitEnemy = (enemyName, damage) => {
  if (GameEnemies[enemyName]) {
    GameEnemies[enemyName].loseHealth(damage)
  }
}

const removeEnemy = enemyName => {
  if (GameEnemies[enemyName]) {
    GameEnemies[enemyName].enemyHealthBar.kill()
    GameEnemies[enemyName].destroy()
  }
  delete GameEnemies[enemyName]
}

const getItems = items => {
  for (const item in GameItems) delete GameItems[item]
  Object.keys(items).forEach(itemName => {
    addItem(items[itemName])
  })
}

const addItem = item => {
  GameItems[item.name] = new Loot(StackQuest.game, item.name, { x: item.position.x, y: item.position.y }, item.key)
}

const removeItem = itemName => {
  if (GameItems[itemName]) {
    GameItems[itemName].destroy()
  }
  delete GameItems[itemName]
}

socketFunctions(socket)

export default socketFunctions
