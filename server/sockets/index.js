const db = require('APP/db')
const Character = db.model('characters')
const GamePlayers = {}
const Enemies = require('./enemies.json')
const EasystarConstructor = require('easystarjs')
const Easystar = new EasystarConstructor.js()
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

    socket.on('addEnemy', () => {
      const newEnemy = {
        name: `testMonster ${Object.keys(Enemies.fantasyState).length+1}`,
        x: Math.random()*1200,
        y: Math.random()*1200,
        key: 'soldier'
      }
      Enemies.fantasyState[newEnemy.name] = newEnemy
      socket.emit('enemyCreated', newEnemy)
    })

    socket.on('updateEnemy', (enemy) => {
      Enemies.fantasyState[enemy.name] = enemy
      socket.broadcast.to(room).emit('enemyUpdated', enemy)
    })

    socket.on('getEnemies', ({state}) => {
      // const EnemiesOnState = JSON.parse(Enemies[state])
      socket.emit('sendEnemies', Enemies[state])
    })

    socket.on('createCollisionArray', ({array}) => {
      collisionArray = array
      Easystar.setGrid(collisionArray)
      Easystar.setAcceptableTiles([0])
      Easystar.enableDiagonals()
    })

    socket.on('moveEnemy', ({name, startPosition, targetPosition}) => {
      Easystar.findPath(
        Math.floor(startPosition.x / collisionArray[0].length),
        Math.floor(startPosition.y / collisionArray.length),
        Math.floor(targetPosition.x / collisionArray[0].length),
        Math.floor(targetPosition.y / collisionArray.length),
        path => findPathCallback(path, name))
      Easystar.calculate()
    })

    function findPathCallback(path, name) {
      socket.emit('foundPath', {path, name})
    }

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
