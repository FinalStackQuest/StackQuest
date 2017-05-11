const db = require('APP/db')
const Character = db.model('characters')

const GamePlayers = {}
const Enemies = require('./enemies.json')
const collisionArrays = {}

const EasystarConstructor = require('easystarjs')
const Easystar = new EasystarConstructor.js()

const findClosestPlayer = require('./utils').findClosestPlayer

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

    socket.on('addEnemy', () => {
      const enemy = {
        name: `testMonster ${Object.keys(Enemies[room]).length+1}`,
        x: Math.random()*600,
        y: Math.random()*600,
        key: 'soldier'
      }
      Enemies[room][enemy.name] = enemy
      io.sockets.to(room).emit('enemyCreated', enemy)
    })

    socket.on('killEnemy', name => {
      delete Enemies[room][name]
      socket.broadcast.to(room).emit('removeEnemy', name)
    })

    // socket.on('moveEnemy', ({name}) => {
    //   const enemy = Enemies[room][name]
    //   const closestPlayer = findClosestPlayer(GamePlayers[room], enemy)
    //   if (closestPlayer) {
    //     Easystar.findPath(
    //       Math.floor(enemy.x / collisionArrays[room][0].length),
    //       Math.floor(enemy.y / collisionArrays[room].length),
    //       Math.floor(closestPlayer.x / collisionArrays[room][0].length),
    //       Math.floor(closestPlayer.y / collisionArrays[room].length),
    //       path => io.sockets.to(room).emit('foundPath', {path, name}))
    //     Easystar.calculate()
    //   }
    // })

    function enemyMovement() {
      Object.keys(Enemies[room]).forEach(name => {
        const enemy = Enemies[room][name]
        const closestPlayer = findClosestPlayer(GamePlayers[room], enemy)
        if (closestPlayer) {
          Easystar.findPath(
            Math.floor(enemy.x / collisionArrays[room][0].length),
            Math.floor(enemy.y / collisionArrays[room].length),
            Math.floor(closestPlayer.x / collisionArrays[room][0].length),
            Math.floor(closestPlayer.y / collisionArrays[room].length),
            path => socket.emit('foundPath', {path, name}))
          Easystar.calculate()
        }
      })
    }


    socket.on('createCollisionArray', ({array}) => {
      if (!collisionArrays[room]) {
        collisionArrays[room] = array
        Easystar.setGrid(array)
        Easystar.setAcceptableTiles([0])
        Easystar.enableDiagonals()
      }
      io.sockets.to(room).emit('madeCollisionArray')
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

      if (!Enemies[room]) Enemies[room] = {}

      socket.emit('getEnemies', Enemies[room])

      if (collisionArrays[room]) {
        socket.emit('madeCollisionArray')
      }

      socket.broadcast.to(room).emit('addPlayer', socket.id, player)
      setInterval(enemyMovement, 200)
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
