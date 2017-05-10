import socketio from 'socket.io-client'

export const socket = socketio.connect()
export const GamePlayers = {}

const socketFunctions = socket => {
  socket.on('getPlayers', getPlayers)
  socket.on('addPlayer', addPlayer)
  socket.on('updatePlayer', updatePlayer)
  socket.on('removePlayer', removePlayer)
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

socketFunctions(socket)

export default socketFunctions
