import socketio from 'socket.io-client'
import Enemy from './classes/Enemy'
import Player from './classes/Player'
import Loot from './classes/Loot'
import Game from './classes/Game'
/* global StackQuest */
export const socket = socketio.connect()

const socketFunctions = socket => {
  socket.on('connected', getCurrentPlayerId)
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
  socket.on('defeatPlayer', defeatPlayer)
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
  socket.on('updateLeaderBoard', updateLeaderBoard)
}

const getCurrentPlayerId = ({playerId}) => {
  Game.currentPlayerId = playerId
}

const getPlayers = players => {
    for (const player in Game.players) Game.currentPlayerId !== player && delete Game.players[player]
    Object.keys(players).forEach(playerSocketId => {
      addPlayer(playerSocketId, players[playerSocketId])
    })
}

const addPlayer = (socketId, player) => {
  new Player(StackQuest.game, player.userName, player, socketId)
}

const updatePlayer = (socketId, player) => {
  Game.players[socketId].killCount = player.killCount
  Game.players[socketId].lootCount = player.lootCount
  Game.players[socketId].moveOther(player.playerPos.x, player.playerPos.y)
}

const removePlayer = socketId => {
  if (Game.players[socketId]) {
    Game.players[socketId].playerHealthBar.kill()
    Game.players[socketId].destroy()
  }
  delete Game.players[socketId]
}

const defeatPlayer = () => {
  console.log('defeated player')
  Game.currentPlayer.pvpCount ++
  Game.currentPlayer.HUD.updateCount()
}

const updateStats = (socketId, stats) => {
  if (Game.players[socketId]) {
    Game.players[socketId].stats = stats
    Game.players[socketId].computeLifeBar()
  }
}

const fireProjectile = (socketId, xCoord, yCoord) => {
  if (Game.players[socketId]) {
    Game.players[socketId].weapon.fire(null, xCoord, yCoord)
  }
}

const fireSpecial = (socketId, xCoord, yCoord) => {
  if (Game.players[socketId]) {
    Game.players[socketId].special.fire(null, xCoord, yCoord)
  }
}

const getEnemies = enemies => {
  for (const enemy in Game.enemies) delete Game.enemies[enemy]
  Object.keys(enemies).forEach(enemyName => {
    addEnemy(enemies[enemyName])
  })
}

const addEnemy = enemy => {
  new Enemy(StackQuest.game, enemy.name, { x: enemy.x, y: enemy.y }, enemy.spriteKey, enemy.stats)
}

const updateEnemy = (newPos, name) => {
  if (Game.enemies[name]) Game.enemies[name].move(newPos)
}

const hitEnemy = (enemyName, damage) => {
  if (Game.enemies[enemyName]) {
    Game.enemies[enemyName].loseHealth(damage)
  }
}

const removeEnemy = enemyName => {
  if (Game.enemies[enemyName]) {
    Game.enemies[enemyName].enemyHealthBar.kill()
    Game.enemies[enemyName].destroy()
  }
  delete Game.enemies[enemyName]
}

const getItems = items => {
  for (const item in Game.items) delete Game.items[item]
  Object.keys(items).forEach(itemName => {
    addItem(items[itemName])
  })
}

const addItem = item => {
  new Loot(StackQuest.game, item.name, { x: item.position.x, y: item.position.y }, item.key)
}

const removeItem = itemName => {
  if (Game.items[itemName]) {
    Game.items[itemName].destroy()
  }
  delete Game.items[itemName]
}

const updateLeaderBoard = topPlayers => {
  const currentPlayer = Game.currentPlayer
  if (currentPlayer && currentPlayer.HUD) {
    currentPlayer.HUD.updateLeaderBoard(topPlayers)
  }
}

socketFunctions(socket)

export default socketFunctions
