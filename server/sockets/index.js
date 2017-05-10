const db = require('APP/db')
const Character = db.model('characters')
const GamePlayers = {}
const Enemies = require('./enemies.json')

const socketFunction = io => {
  io.on('connection', socket => {
    console.log('got a connection', socket.id)
    // console.log('enemies', Enemies)
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

    socket.on('addEnemy', (enemy) => {
      console.log('did we get the enemy?', enemy)
      Enemies.fantasyState[enemy.name] = enemy
      console.log('did it get added to JSON?', Enemies.fantasyState[enemy.name])
      socket.broadcast.to(room).emit('enemyCreated', enemy)
    })

    socket.on('updateEnemy', (enemy) => {
      console.log('did enemy update?', enemy)
      Enemies.fantasyState[enemy.name] = enemy
      socket.broadcast.to(room).emit('enemyUpdated', enemy)
    })

    socket.on('getEnemies', ({state}) => {
      console.log('did state get thru', state)
      console.log('EnemiesState', Enemies[state])
      // const EnemiesOnState = JSON.parse(Enemies[state])
      socket.emit('sendEnemies', Enemies[state])
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

    socket.on('savePlayer', player => {
      Character.update(player, {
        where: {
          id: player.id
        },
      })
    })
  })
}

module.exports = socketFunction
