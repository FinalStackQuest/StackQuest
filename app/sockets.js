import socketio from 'socket.io-client'
import Enemy from './constructor/Enemy'

export const socket = socketio.connect()
export const GamePlayers = {}
export const GameEnemies = {}
export let collisionArrayStatus = false

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
  socket.on('enemyCreated', enemyCreated)
  socket.on('foundPath', foundPath)
  socket.on('getEnemies', getEnemies)
  socket.on('createdCollisionArray', createdCollisionArray)
  socket.on('removeEnemy', removeEnemy)
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
    player.kill()
    delete GamePlayers[socketId]
  }
}

const enemyCreated = enemy => {
  GameEnemies[enemy.name] = new Enemy(StackQuest.game, enemy.name, {x: enemy.x, y: enemy.y}, enemy.key)
}

const foundPath = (path, name) => {
  if (GameEnemies[name]) GameEnemies[name].move(path)
}

const getEnemies = enemies => {
  for (const enemy in GameEnemies) delete GameEnemies[enemy]
  Object.keys(enemies).forEach(enemyName => {
    const enemy = enemies[enemyName]
    GameEnemies[enemyName] = new Enemy(StackQuest.game, enemyName, {x: enemy.x, y: enemy.y}, enemy.key)
  })
}

const removeEnemy = name => {
  GameEnemies[name].kill()
  delete GameEnemies[name]
}

const createdCollisionArray = (state) => {
  collisionArrayStatus = true
}

socketFunctions(socket)

export default socketFunctions
