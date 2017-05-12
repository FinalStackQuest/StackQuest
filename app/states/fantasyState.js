 // fix loot here
import Loot from '../classes/Loot'
import { collisionArrayStatus, GameEnemies, GamePlayers, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import createMap from './utils/createMap'
import createCursors from './utils/createCursors'
import createPlayer from './utils/createPlayer'
import createProjectile from './utils/createProjectile'
import playerMovement from './utils/playerMovement'
import playerAttack from './utils/playerAttack'
import mapTransition from './utils/mapTransition'
import enemyCollision from './utils/enemyCollision'
import playerClass from '../classes/Player'

/* global StackQuest, Phaser */

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
    map = createMap.fantasy()

    socket.emit('setupState', player, 'fantasyState')

    playerObject = createPlayer(player)
    projectile = createProjectile.bullet(playerObject)

    if (!collisionArrayStatus) {
      this.makeCollisionMap()
    }

    this.spawnLoot()

    this.physics.setBoundsToWorld(true, true, true, true, false)

    StackQuest.game.input.onDown.add((pointer, mouseEvent) => playerAttack(pointer, mouseEvent, playerObject, projectile), this)
  },

  update() {
    graveyard.forEach(enemy => {
      enemy.destroy()
      delete GameEnemies[enemy.name]
      socket.emit('killEnemy', enemy.name)
    })
    graveyard = []

    // spawn loot
    if (Math.random() * 1000 <= 1) this.spawnLoot()

    for (const enemyKey in localState.enemies) {
      this.enemyPathFinding(enemyKey)
    }

    // TODO: export fn to utils file
    this.itemCollision()
    enemyCollision(playerObject, projectile, graveyard)
    playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'spaceState')
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  },

  // TODO export to utils file
  itemCollision() {
    for (const itemKey in localState.loot) {
      let self = this
      const item = localState.loot[itemKey]
      this.physics.arcade.collide(playerObject, item, function(player, item) {
        if (item.type === 'loot') {
          lootTouched++
          const lootCount = self.game.add.text(player.x, player.y + 20, 'Loot acquired ' + lootTouched, { font: '22px Times New Roman', fill: '#ffffff' })
          setTimeout(() => { lootCount.destroy() }, 3000)
        } else if (item.type === 'weapon') {
          const weaponNotice = self.game.add.text(player.x, player.y + 20, 'Weapon acquired, 2X Damage! ', { font: '22px Times New Roman', fill: '#ffffff' })
          // for now, doubling our projectile damage
          console.log('old proj damage', projectile.damage)
          projectile.damage *= 2
          console.log('new proj damage', projectile.damage)
          setTimeout(() => { weaponNotice.destroy() }, 3000)
        } else {
          const armorNotice = self.game.add.text(player.x, player.y + 20, 'Armor acquired, 2X Health! ', { font: '22px Times New Roman', fill: '#ffffff' })
          // for now, double's the player's internal HP stat
          console.log('old hp', playerObject.internalStats.hp)
          playerObject.internalStats.hp *= 2
          console.log('new hp', playerObject.internalStats.hp)
          setTimeout(() => { armorNotice.destroy() }, 3000)
        }
        item.destroy()
      })
    }
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

  spawnLoot() {
    localState.loot[lootCounter++] = new Loot(this.game, 'Item', { x: Math.random() * 1920, y: Math.random() * 1080 }, 'item')
  }
}

export default fantasyState
