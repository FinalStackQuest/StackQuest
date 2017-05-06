const GamePlayers = {}

const socket = io => {
  io.on('connection', socket => {
    console.log('got a connection', socket.id)

    socket.on('disconnect', () => {
      delete GamePlayers[socket.id]
      socket.broadcast.emit('removePlayer', socket.id)
      console.log(socket.id, 'disconnected')
    })

    socket.on('getPlayers', () => {
      socket.emit('getPlayers', GamePlayers)
    })

    socket.on('addPlayer', player => {
      GamePlayers[socket.id] = player
      socket.broadcast.emit('addPlayer', socket.id, player)
    })

    socket.on('updatePlayer', playerPos => {
      // GamePlayers[socket.id] = Object.assign({}, GamePlayers[socket.id], { pos: { x: playerPos.x, y: playerPos.y } })
      if (GamePlayers[socket.id]) {
        GamePlayers[socket.id] = { class: GamePlayers[socket.id].class, pos: { x: playerPos.x, y: playerPos.y } }
        socket.broadcast.emit('updatePlayer', socket.id, playerPos)
      }
    })

    socket.on('removePlayer', () => {
      delete GamePlayers[socket.id]
      socket.broadcast.emit('removePlayer', socket.id)
    })
  })
}

module.exports = socket
