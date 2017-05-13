import socketio from 'socket.io-client'
import Enemy from './classes/Enemy'
import Player from './classes/Player'
import Loot from './classes/Loot'

/* global StackQuest */

export const socket = socketio.connect()
export const GamePlayers = {}
export const GameEnemies = {}
export const GameItems = {}
export let collisionArrayStatus = false

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
  socket.on('fireProjectile', fireProjectile)
  socket.on('enemyCreated', enemyCreated)
  socket.on('foundPath', foundPath)
  socket.on('getEnemies', getEnemies)
  socket.on('createdCollisionArray', createdCollisionArray)
  socket.on('removeEnemy', removeEnemy)
  socket.on('addItem', addItem)
  socket.on('getItems', getItems)
  socket.on('removeItem', removeItem)
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

const enemyCreated = enemy => {
  GameEnemies[enemy.name] = new Enemy(StackQuest.game, enemy.name, { x: enemy.x, y: enemy.y }, enemy.key)
}

const foundPath = (newPos, name) => {
  if (GameEnemies[name]) GameEnemies[name].move(newPos)
}

const getEnemies = enemies => {
  for (const enemy in GameEnemies) delete GameEnemies[enemy]
  Object.keys(enemies).forEach(enemyName => {
    const enemy = enemies[enemyName]
    GameEnemies[enemyName] = new Enemy(StackQuest.game, enemyName, { x: enemy.x, y: enemy.y }, enemy.key)
  })
}

const removeEnemy = enemyName => {
  if (GameEnemies[enemyName]) {
    GameEnemies[enemyName].enemyHealthBar.kill()
    GameEnemies[enemyName].destroy()
  }
  delete GameEnemies[enemyName]
}

const addItem = item => {
  GameItems[item.name] = new Loot(StackQuest.game, item.name, {x: item.itemPos.x, y: item.itemPos.y}, 'item')
}

const getItems = items => {
  for (const item in GameItems) delete GameItems[item]
  Object.keys(items).forEach(itemName => {
    const item = items[itemName]
    GameItems[itemName] = new Loot(StackQuest.game, itemName, { x: item.x, y: item.y }, item.key)
  })
}

const removeItem = itemName => {
  if (GameItems[itemName]) {
    GameItems[itemName].destroy()
  }
  delete GameItems[itemName]
}

const createdCollisionArray = (state) => {
  collisionArrayStatus = true
}

socketFunctions(socket)

export default socketFunctions
