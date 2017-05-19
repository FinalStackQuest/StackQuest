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
  socket.on('defeatedPlayer', defeatedPlayer)
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
    for (const player in Game.GamePlayers) Game.currentPlayerId !== player && delete Game.GamePlayers[player]
    Object.keys(players).forEach(playerSocketId => {
      addPlayer(playerSocketId, players[playerSocketId])
    })
}

const addPlayer = (socketId, player) => {
  new Player(StackQuest.game, player.userName, player, socketId)
}

const updatePlayer = (socketId, player) => {
  Game.GamePlayers[socketId].killCount = player.killCount
  Game.GamePlayers[socketId].lootCount = player.lootCount
  Game.GamePlayers[socketId].moveOther(player.playerPos.x, player.playerPos.y)
}

const removePlayer = socketId => {
  if (Game.GamePlayers[socketId]) {
    Game.GamePlayers[socketId].playerHealthBar.kill()
    Game.GamePlayers[socketId].destroy()
  }
  delete Game.GamePlayers[socketId]
}

const defeatedPlayer = () => {
  const currentPlayer = Game.GamePlayers[Game.currentPlayerId]
  currentPlayer.pvpCount ++
  currentPlayer.HUD.updateCount()
}

const updateStats = (socketId, stats) => {
  if (Game.GamePlayers[socketId]) {
    Game.GamePlayers[socketId].stats = stats
    Game.GamePlayers[socketId].computeLifeBar()
  }
}

const fireProjectile = (socketId, xCoord, yCoord) => {
  if (Game.GamePlayers[socketId]) {
    Game.GamePlayers[socketId].weapon.fire(null, xCoord, yCoord)
  }
}

const fireSpecial = (socketId, xCoord, yCoord) => {
  if (Game.GamePlayers[socketId]) {
    Game.GamePlayers[socketId].special.fire(null, xCoord, yCoord)
  }
}

const getEnemies = enemies => {
  for (const enemy in Game.GameEnemies) delete Game.GameEnemies[enemy]
  Object.keys(enemies).forEach(enemyName => {
    addEnemy(enemies[enemyName])
  })
}

const addEnemy = enemy => {
  new Enemy(StackQuest.game, enemy.name, { x: enemy.x, y: enemy.y }, enemy.spriteKey, enemy.stats)
}

const updateEnemy = (newPos, name) => {
  if (Game.GameEnemies[name]) Game.GameEnemies[name].move(newPos)
}

const hitEnemy = (enemyName, damage) => {
  if (Game.GameEnemies[enemyName]) {
    Game.GameEnemies[enemyName].loseHealth(damage)
  }
}

const removeEnemy = enemyName => {
  if (Game.GameEnemies[enemyName]) {
    Game.GameEnemies[enemyName].enemyHealthBar.kill()
    Game.GameEnemies[enemyName].destroy()
  }
  delete Game.GameEnemies[enemyName]
}

const getItems = items => {
  for (const item in Game.GameItems) delete Game.GameItems[item]
  Object.keys(items).forEach(itemName => {
    addItem(items[itemName])
  })
}

const addItem = item => {
  new Loot(StackQuest.game, item.name, { x: item.position.x, y: item.position.y }, item.key)
}

const removeItem = itemName => {
  if (Game.GameItems[itemName]) {
    Game.GameItems[itemName].destroy()
  }
  delete Game.GameItems[itemName]
}

const updateLeaderBoard = topPlayers => {
  const currentPlayer = Game.currentPlayer
  if (currentPlayer.HUD) {
    currentPlayer.HUD.updateLeaderBoard(topPlayers)
  }
}

socketFunctions(socket)

export default socketFunctions
