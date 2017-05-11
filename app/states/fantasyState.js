 // fix loot here
import Loot from '../constructor/Loot'
import { collisionArrayStatus, GameEnemies, GamePlayers, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import buildMaps from './utils/buildMaps'
import createCursors from './utils/createCursors'
import createPlayer from './utils/createPlayer'
import createProjectile from './utils/createProjectile'
import playerMovement from './utils/playerMovement'
import playerAttack from './utils/playerAttack'
import mapTransition from './utils/mapTransition'
import playerClass from '../constructor/Player'

let map
  , cursors
  , playerObject
  , player
  , projectile
  , graveyard = []
  , lootCounter = 0
  , lootTouched = 0

// TODO get rid of this (put in sockets) ?
const localState = {
  players: [],
  enemies: {},
  loot: []
}

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
    this.spawnLoot()

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

    // spawn loot
    if (Math.random() * 1000 <= 25) this.spawnLoot()

    for (const enemyKey in localState.enemies) {
      this.enemyPathFinding(enemyKey)
    }

    // should abstract into different fn
    for (const itemKey in localState.loot) {
      let self = this
      const item = localState.loot[itemKey]
      this.physics.arcade.collide(playerObject, item, function(player, loot) {
        lootTouched++
        const lootCount = self.game.add.text(player.x, player.y + 20, 'Loot acquired ' + lootTouched, { font: '22px Times New Roman', fill: '#ffffff' })
        setTimeout(() => { lootCount.destroy() }, 3000)
        loot.destroy()
      })
    }

    playerMovement(playerObject, cursors)
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
        playerObject.internalStats.hp -= enemy.attack()

        if (playerObject.internalStats.hp <= 0) {
          playerObject.position.x = 200
          playerObject.position.y = 200
          //  reset internal health: TEMP
          playerObject.internalStats.hp = 100
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
  spawnLoot() {
    localState.loot[lootCounter++] = new Loot(this.game, 'Item', { x: Math.random() * 1920, y: Math.random() * 1080 }, 'item')
  }
}

export default fantasyState
