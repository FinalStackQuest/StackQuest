import socketio from 'socket.io-client'
import Enemy from './classes/Enemy'
import Player from './classes/Player-temp'

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
    GamePlayers[playerSocketId] = new Player(StackQuest.game, 'otherPlayer', players[playerSocketId])
  })
}

const addPlayer = (socketId, player) => {
  GamePlayers[socketId] = new Player(StackQuest.game, 'otherPlayer', player)
}

const updatePlayer = (socketId, playerPos) => {
  GamePlayers[socketId].moveOther(playerPos.x, playerPos.y)
  // GamePlayers[socketId].position.y = playerPos.y
}

const removePlayer = socketId => {
  const player = GamePlayers[socketId]
  if (player) {
    player.destroy()
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
  GameEnemies[name].destroy()
  delete GameEnemies[name]
}

const createdCollisionArray = (state) => {
  collisionArrayStatus = true
}

socketFunctions(socket)

export default socketFunctions
