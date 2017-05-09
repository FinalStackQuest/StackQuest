const GamePlayers = {}

const socketFunction = io => {
  io.on('connection', socket => {
    console.log('got a connection', socket.id)

    let room = 'world'
    socket.join(room)

    socket.on('disconnect', () => {
      if (GamePlayers[room]) {
        delete GamePlayers[room][socket.id]
        socket.broadcast.to(room).emit('removePlayer', socket.id)
      }
      console.log(socket.id, 'disconnected')
    })

    socket.on('joinroom', newRoom => {
      socket.leave(room)
      room = newRoom
      socket.join(room)
      if (!GamePlayers[room]) GamePlayers[room] = {}
    })

    socket.on('getPlayers', () => {
      socket.emit('getPlayers', GamePlayers[room])
    })

    socket.on('addPlayer', player => {
      GamePlayers[room][socket.id] = player
      socket.broadcast.to(room).emit('addPlayer', socket.id, player)
    })

    socket.on('updatePlayer', playerPos => {
      GamePlayers[room][socket.id] = Object.assign({}, GamePlayers[room][socket.id], { x: playerPos.x, y: playerPos.y })
      socket.broadcast.to(room).emit('updatePlayer', socket.id, playerPos)
    })

    socket.on('removePlayer', () => {
      if (GamePlayers[room]) {
        delete GamePlayers[room][socket.id]
        socket.broadcast.to(room).emit('removePlayer', socket.id)
      }
    })

    socket.on('setupState', (player, newRoom) => {
      // remove player from previous map (room)
      if (GamePlayers[room]) {
        delete GamePlayers[room][socket.id]
        socket.broadcast.to(room).emit('removePlayer', socket.id)
      }
      // join new map
      socket.leave(room)
      room = newRoom
      socket.join(room)
      if (!GamePlayers[room]) GamePlayers[room] = {}
      // get all players on the same map
      socket.emit('getPlayers', GamePlayers[room])
      // add player to map
      GamePlayers[room][socket.id] = player
      socket.broadcast.to(room).emit('addPlayer', socket.id, player)
    })
  })
}

module.exports = socketFunction
