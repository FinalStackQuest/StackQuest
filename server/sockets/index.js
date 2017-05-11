const db = require('APP/db')
const Character = db.model('characters')
const GamePlayers = {}
const Enemies = require('./enemies.json')
const EasystarConstructor = require('easystarjs')
const Easystar = new EasystarConstructor.js()

const findClosestPlayer = require('./utils').findClosestPlayer
let collisionArray

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

    socket.on('addEnemy', ({state}) => {
      const newEnemy = {
        name: `testMonster ${Object.keys(Enemies[state]).length+1}`,
        x: Math.random()*1200,
        y: Math.random()*1200,
        key: 'soldier'
      }
      Enemies[state][newEnemy.name] = newEnemy
      io.sockets.to(room).emit('enemyCreated', newEnemy)
    })

    socket.on('updateEnemy', (enemy) => {
      Enemies.fantasyState[enemy.name] = enemy
      socket.broadcast.to(room).emit('enemyUpdated', enemy)
    })

    socket.on('getEnemies', ({state}) => {
      socket.emit('sendEnemies', Enemies[state])
    })

    socket.on('createCollisionArray', ({array}) => {
      collisionArray = array
      Easystar.setGrid(collisionArray)
      Easystar.setAcceptableTiles([0])
      Easystar.enableDiagonals()
    })

    socket.on('moveEnemy', ({name, state}) => {
      if (GamePlayers[state] && Enemies[state]) {
        const enemy = Enemies[state][name]
        const closestPlayer = findClosestPlayer(GamePlayers[state], enemy)
        if (closestPlayer) {
          Easystar.findPath(
            Math.floor(enemy.x / collisionArray[0].length),
            Math.floor(enemy.y / collisionArray.length),
            Math.floor(closestPlayer.x / collisionArray[0].length),
            Math.floor(closestPlayer.y / collisionArray.length),
            path => io.sockets.to(room).emit('foundPath', {path, name}))
          Easystar.calculate()
        }
      }
    })

    // socket.on('moveEnemy', ({name, startingPos, targetPos}) => {
    //   Easystar.findPath(
    //     Math.floor(startingPos.x / collisionArray[0].length),
    //     Math.floor(startingPos.y / collisionArray.length),
    //     Math.floor(targetPos.x / collisionArray[0].length),
    //     Math.floor(targetPos.y / collisionArray.length),
    //     path => io.sockets.to(room).emit('foundPath', {path, name}))
    //   Easystar.calculate()
    // })

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
