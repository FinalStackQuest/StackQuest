const _ = require('lodash')
const db = require('APP/db')
const Character = db.model('characters')

const messages = []

const enemyProperties = require('APP/app/properties/enemyProperties')
const enemySpawn = require('./enemySpawn.json')
const GamePlayers = {}
const GameEnemies = {}
const GameItems = {}
const collisionArrays = {}
const isUpdating = {}

const EasystarConstructor = require('easystarjs')

const findClosestPlayer = require('./utils').findClosestPlayer

const tileWidth = 32
const tileHeight = 32

const enemyMovement = (io, state) => {
  if (Object.keys(GamePlayers[state]).length) {
    Object.keys(GameEnemies[state]).forEach(enemyName => {
      const enemy = GameEnemies[state][enemyName]
      const closestPlayer = findClosestPlayer(GamePlayers[state], enemy)
      if (closestPlayer) {
        collisionArrays[state].findPath(
          Math.floor(enemy.x / tileWidth),
          Math.floor(enemy.y / tileHeight),
          Math.floor(closestPlayer.x / tileWidth),
          Math.floor(closestPlayer.y / tileHeight),
          path => {
            if (path && path[1]) {
              const newX = path[1].x * tileWidth
              const newY = path[1].y * tileHeight
              const distance = 1
              enemy.x += newX - enemy.x > 0 ? distance : -distance
              enemy.y += newY - enemy.y > 0 ? distance : -distance
              const newPos = { x: enemy.x, y: enemy.y }
              io.sockets.to(state).emit('updateEnemy', newPos, enemyName)
            }
          }
        )
        collisionArrays[state].calculate()
      }
    })
  }
}

const spawnEnemy = (io, state) => {
  if (Object.keys(GamePlayers[state]).length) {
    enemySpawn[state].forEach((enemy) => {
      if (!GameEnemies[state][enemy.name]) {
        GameEnemies[state][enemy.name] = Object.assign({}, enemy, _.cloneDeep(enemyProperties[enemy.spriteKey]))
        io.sockets.to(state).emit('addEnemy', GameEnemies[state][enemy.name])
      }
    })
  }
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
      try {
        delete GamePlayers[room][socket.id]
        socket.broadcast.to(room).emit('removePlayer', socket.id)
      } catch (e) {
        console.log('error:', e)
      }
      console.log(socket.id, 'disconnected')
    })

    socket.on('updatePlayer', player => {
      try {
        GamePlayers[room][socket.id] = Object.assign({}, GamePlayers[room][socket.id], { x: player.playerPos.x, y: player.playerPos.y, lootCount: player.lootCount, killCount: player.killCount })
        socket.broadcast.to(room).emit('updatePlayer', socket.id, player)
      } catch (e) {
        console.log('error', e)
      }
    })

    socket.on('updateStats', stats => {
      try {
        GamePlayers[room][socket.id].stats = stats
        socket.broadcast.to(room).emit('updateStats', socket.id, stats)
      } catch (e) {
        console.log('error', e)
      }
    })

    socket.on('fireProjectile', (xCoord, yCoord) => {
      socket.broadcast.to(room).emit('fireProjectile', socket.id, xCoord, yCoord)
    })

    socket.on('fireSpecial', (xCoord, yCoord) => {
      socket.broadcast.to(room).emit('fireSpecial', socket.id, xCoord, yCoord)
    })

    socket.on('hitEnemy', (enemyName, damageTaken) => {
      try {
        GameEnemies[room][enemyName].stats.hp -= damageTaken
        socket.broadcast.to(room).emit('hitEnemy', enemyName, damageTaken)
      } catch (e) {
        console.log('error', e)
      }
    })

    socket.on('killEnemy', enemyName => {
      try {
        delete GameEnemies[room][enemyName]
        socket.broadcast.to(room).emit('removeEnemy', enemyName)
      } catch (e) {
        console.log('error', e)
      }
    })

    socket.on('createItem', item => {
      try {
        GameItems[room][item.name] = item
        socket.broadcast.to(room).emit('addItem', item)
      } catch (e) {
        console.log('error', e)
      }
    })

    socket.on('killItem', name => {
      try {
        delete GameItems[room][name]
        socket.broadcast.to(room).emit('removeItem', name)
      } catch (e) {
        console.log('error', e)
      }
    })

    socket.on('setupState', (player, collisionMap, newRoom) => {
      // remove player from previous map (room)
      try {
        delete GamePlayers[room][socket.id]
        socket.broadcast.to(room).emit('removePlayer', socket.id)
      } catch (e) {
        console.log('error', e)
      }

      // join new map
      socket.leave(room)
      room = newRoom
      socket.join(room)
      if (!GamePlayers[room]) GamePlayers[room] = {}
      if (!GameEnemies[room]) GameEnemies[room] = {}
      if (!GameItems[room]) GameItems[room] = {}

      // get all players and enemies on the map
      socket.emit('getPlayers', GamePlayers[room])
      socket.emit('getEnemies', GameEnemies[room])
      socket.emit('getItems', GameItems[room])

      // add player to map
      GamePlayers[room][socket.id] = player
      socket.broadcast.to(room).emit('addPlayer', socket.id, player)

      // check if collision array exist for this map
      // creates collision array if it does not exist
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

    socket.on('getMessages', () => {
      socket.emit('getMessages', messages)
    })

    socket.on('addMessage', message => {
      if (messages.length >= 100) messages.shift()
      messages.push(message)
      socket.broadcast.emit('addMessage', message)
    })
  })
}

module.exports = socketFunction
