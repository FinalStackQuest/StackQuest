import { collisionArrayStatus, GameEnemies, GamePlayers, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import buildMaps from './utils/buildMaps'
import createCursors from './utils/createCursors'
import createPlayer from './utils/createPlayer'
import createProjectile from './utils/createProjectile'
import playerMovement from './utils/playerMovement'
import playerAttack from './utils/playerAttack'
import mapTransition from './utils/mapTransition'

let map
  , cursors
  , playerObject
  , player
  , projectile
  , graveyard = []

const fantasyState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.fantasy()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    cursors = createCursors()
    map = buildMaps.fantasy()

    socket.emit('setupState', player, 'fantasyState')

    playerObject = createPlayer(player)
    projectile = createProjectile.bullet(playerObject)

    if (!collisionArrayStatus) {
      this.makeCollisionMap()
    }

    this.spawnEnemy()

    this.physics.setBoundsToWorld(true, true, true, true, false)

    this.game.input.onDown.add((pointer, mouseEvent) => playerAttack(pointer, mouseEvent, playerObject, projectile), this)
  },

  update() {
    graveyard.forEach(enemy => {
      enemy.destroy()
      delete GameEnemies[enemy.name]
      socket.emit('killEnemy', enemy.name)
    })
    graveyard = []

    // playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'spaceState')

    this.enemyCollision()
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  },

  enemyCollision() {
    Object.keys(GameEnemies).forEach(enemyKey => {
      const enemy = GameEnemies[enemyKey]
      StackQuest.game.physics.arcade.overlap(projectile.bullets, enemy, () => {
        let didDie = enemy.takeDamage(projectile.damage)
  
        if (didDie) {
          graveyard.push(enemy)
          delete GameEnemies[enemyKey]
        }
      })
      StackQuest.game.physics.arcade.overlap(enemy, playerObject, () => {
        playerObject.stats.hp -= enemy.attack()
        
        if (playerObject.stats.hp <= 0) {
          playerObject.position.x = 200
          playerObject.position.y = 200
          //  reset internal health: TEMP
          playerObject.stats.hp = 100
          socket.emit('updatePlayer', playerObject.position)
        }
      })
    })
  },

  makeCollisionMap() {
    const collisionArray = []
    for (let rowIdx = 0; rowIdx < map.height; rowIdx++) {
      const rowArray = []
      for (let colIdx = 0; colIdx < map.width; colIdx++) {
        let collision = false
        for (const layer of map.layers) {
          if (layer.data[rowIdx][colIdx].collides) {
            collision = true
            break
          }
        }
        rowArray.push(Number(collision))
      }
      collisionArray.push(rowArray)
    }
    socket.emit('createCollisionArray', {array: collisionArray})
  },

  spawnEnemy() {
    socket.emit('addEnemy', {state: 'fantasyState'})
  },
}

export default fantasyState
