const db = require('APP/db')
const Character = db.model('characters')

const enemies = require('./enemies.json')
const GamePlayers = {}
const GameEnemies = {}
const collisionArrays = {}
let isUpdating = false

let enemyMovementInterval
let spawnEnemyInterval

const EasystarConstructor = require('easystarjs')
const Easystar = new EasystarConstructor.js()

const findClosestPlayer = require('./utils').findClosestPlayer

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

    socket.on('updatePlayer', player => {
      if (GamePlayers[room]) {
        GamePlayers[room][socket.id] = Object.assign({}, GamePlayers[room][socket.id], { x: player.playerPos.x, y: player.playerPos.y, lootCount: player.lootCount })
        socket.broadcast.to(room).emit('updatePlayer', socket.id, player)
      }
    })

    socket.on('removePlayer', () => {
      if (GamePlayers[room]) {
        delete GamePlayers[room][socket.id]
        socket.broadcast.to(room).emit('removePlayer', socket.id)
      }
    })

    socket.on('killEnemy', name => {
      if (GameEnemies[room]) {
        delete GameEnemies[room][name]
        socket.broadcast.to(room).emit('removeEnemy', name)
      }
    })

    socket.on('createCollisionArray', arr => {
      if (!collisionArrays[room]) {
        collisionArrays[room] = arr
        Easystar.setGrid(arr)
        Easystar.setAcceptableTiles([0])
        Easystar.enableDiagonals()
      }
      io.sockets.to(room).emit('madeCollisionArray')
    })

    socket.on('updatePosition', (name, x, y) => {
      if (GameEnemies[room][name] && isUpdating) {
        GameEnemies[room][name].x = x
        GameEnemies[room][name].y = y
        isUpdating = false
      }
    })

    function enemyMovement() {
      Object.keys(GameEnemies[room]).forEach(enemyName => {
        const enemy = GameEnemies[room][enemyName]
        const closestPlayer = findClosestPlayer(GamePlayers[room], enemy)
        if (closestPlayer) {
          Easystar.findPath(
            Math.floor(enemy.x / collisionArrays[room][0].length),
            Math.floor(enemy.y / collisionArrays[room].length),
            Math.floor(closestPlayer.x / collisionArrays[room][0].length),
            Math.floor(closestPlayer.y / collisionArrays[room].length),
            path => {
              if (path && path[1]) {
                const newX = path[1].x * collisionArrays[room][0].length
                const newY = path[1].y * collisionArrays[room].length
                const distance = 1
                enemy.x += newX - enemy.x > 0 ? distance : -distance
                enemy.y += newY - enemy.y > 0 ? distance : -distance
                const newPos = { x: enemy.x, y: enemy.y }
                io.sockets.to(room).emit('foundPath', newPos, enemyName)
              }
            })
          Easystar.calculate()
        }
      })
    }

    function spawnEnemy() {
      enemies[room].forEach((enemy) => {
        if (!GameEnemies[room][enemy.name]) {
          GameEnemies[room][enemy.name] = Object.assign({}, enemy)
          io.sockets.to(room).emit('enemyCreated', enemy)
        }
      })
    }

    socket.on('setupState', (player, newRoom) => {
      clearInterval(enemyMovementInterval)
      clearInterval(spawnEnemyInterval)
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

      if (!GameEnemies[room]) GameEnemies[room] = {}

      socket.emit('getEnemies', GameEnemies[room])

      if (collisionArrays[room]) {
        socket.emit('madeCollisionArray')
      }

      socket.broadcast.to(room).emit('addPlayer', socket.id, player)

      enemyMovementInterval = setInterval(enemyMovement, 33)
      spawnEnemyInterval = setInterval(spawnEnemy, 10000)
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
