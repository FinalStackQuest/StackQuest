const db = require('APP/db')
const Character = db.model('characters')

const enemies = require('./enemies.json')
const GamePlayers = {}
const GameEnemies = {}
const collisionArrays = {}
const isUpdating = {}

const EasystarConstructor = require('easystarjs')

const findClosestPlayer = require('./utils').findClosestPlayer

const mapWidth = 60
const mapHeight = 60

const enemyMovement = (io, state) => {
  Object.keys(GameEnemies[state]).forEach(enemyName => {
    const enemy = GameEnemies[state][enemyName]
    const closestPlayer = findClosestPlayer(GamePlayers[state], enemy)
    if (closestPlayer) {
      collisionArrays[state].findPath(
        Math.floor(enemy.x / mapWidth),
        Math.floor(enemy.y / mapHeight),
        Math.floor(closestPlayer.x / mapWidth),
        Math.floor(closestPlayer.y / mapHeight),
        path => {
          if (path && path[1]) {
            const newX = path[1].x * mapWidth
            const newY = path[1].y * mapHeight
            const distance = 1
            enemy.x += newX - enemy.x > 0 ? distance : -distance
            enemy.y += newY - enemy.y > 0 ? distance : -distance
            const newPos = { x: enemy.x, y: enemy.y }
            io.sockets.to(state).emit('updateEnemy', newPos, enemyName)
          }
        })
      collisionArrays[state].calculate()
    }
  })
}

const spawnEnemy = (io, state) => {
  enemies[state].forEach((enemy) => {
    if (!GameEnemies[state][enemy.name]) {
      GameEnemies[state][enemy.name] = Object.assign({}, enemy)
      io.sockets.to(state).emit('addEnemy', enemy)
    }
  })
}

const runIntervals = (io, state) => {
  setInterval(() => enemyMovement(io, state), 33)
  setInterval(() => spawnEnemy(io, state), 10000)
}

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

    socket.on('updatePlayer', player => {
      if (GamePlayers[room]) {
        GamePlayers[room][socket.id] = Object.assign({}, GamePlayers[room][socket.id], { x: player.playerPos.x, y: player.playerPos.y, lootCount: player.lootCount })
        socket.broadcast.to(room).emit('updatePlayer', socket.id, player)
      }
    })

    socket.on('fireProjectile', (xCoord, yCoord) => {
      socket.broadcast.to(room).emit('fireProjectile', socket.id, xCoord, yCoord)
    })

    socket.on('killEnemy', name => {
      if (GameEnemies[room]) {
        delete GameEnemies[room][name]
        socket.broadcast.to(room).emit('removeEnemy', name)
      }
    })

    socket.on('setupState', (player, collisionMap, newRoom) => {
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
      if (!GameEnemies[room]) GameEnemies[room] = {}

      // get all players and enemies on the map
      socket.emit('getPlayers', GamePlayers[room])
      socket.emit('getEnemies', GameEnemies[room])

      // add player to map
      GamePlayers[room][socket.id] = player
      socket.broadcast.to(room).emit('addPlayer', socket.id, player)

      if (!collisionArrays[room]) {
        collisionArrays[room] = new EasystarConstructor.js()
        collisionArrays[room].setGrid(collisionMap)
        collisionArrays[room].setAcceptableTiles([0])
        collisionArrays[room].enableDiagonals()
      }

      if (!isUpdating[room]) {
        isUpdating[room] = true
        runIntervals(io, room)
      }
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
