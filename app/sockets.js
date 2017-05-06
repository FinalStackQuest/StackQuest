import StackQuest from './main'

export const GamePlayers = {}

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
}

const getPlayers = players => {
  Object.keys(players).forEach(playerSocketId => {
    GamePlayers[playerSocketId] = StackQuest.add.text(players[playerSocketId].pos.x, players[playerSocketId].pos.y, players[playerSocketId].class, { font: '32px Arial', fill: '#ffffff' })
  })
}

const addPlayer = (socketId, player) => {
  GamePlayers[socketId] = StackQuest.add.text(player.pos.x, player.pos.y, player.class, { font: '32px Arial', fill: '#ffffff' })
}

const updatePlayer = (socketId, playerPos) => {
  const player = GamePlayers[socketId]
  if (player) {
    player.position.x = playerPos.x
    player.position.y = playerPos.y
  }
}

const removePlayer = socketId => {
  GamePlayers[socketId].destroy()
  delete GamePlayers[socketId]
}

export default socketFunctions
