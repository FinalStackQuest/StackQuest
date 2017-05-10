import { GamePlayers, socket } from '../sockets'
<<<<<<< HEAD
const Easystar = require('easystarjs')
import Enemy from '../constructor/Enemy'

let map
  , cursors
  , OGuy
  , xCoord = 100
  , yCoord = 100
  , monster
=======
import loadMaps from './utils/loadMaps'
import buildMaps from './utils/buildMaps'
import playerMovement from './utils/playerMovement'
import mapTransition from './utils/mapTransition'

let map
  , cursors
  , playerObject
  , player
>>>>>>> master

export const fantasyState = {
  init(character) {
    if (character) player = character
  },


  preload() {
    loadMaps.fantasy()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS)

    buildMaps.fantasy()

    socket.emit('setupState', player, 'fantasyState')


    this.makeCollisionMap()

    playerObject = StackQuest.game.add.text(player.x, player.y, player.class, { font: '32px Arial', fill: '#ffffff' })


    this.physics.p2.enable(playerObject)

    // create monster test
    monster = new Enemy(this.game, 'testMonster', {x: 400, y: 400}, 'soldier')
    this.easystar.findPath(Math.floor(monster.position.x / 60), Math.floor(monster.position.y / 60), Math.floor(xCoord / 60), Math.floor(yCoord / 60), monster.move)
    this.easystar.calculate()

    this.camera.follow(playerObject)

    this.physics.p2.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()
  },

  update() {
    playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'spaceState')
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
  ,
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
            // rowArray.push(1)
          }
          // else {
          //   // rowArray.push(0)
          // }
        }
        rowArray.push(Number(collision))
      }
      collisionArray.push(rowArray)
    }
    console.log('collis array?', collisionArray)
    this.easystar = new Easystar.js()
    this.easystar.setGrid(collisionArray)
    this.easystar.setAcceptableTiles([0])
    // this.easystar.findPath(20, 20, 50, 50, (path) => {
    //   console.log('path?', path)
    // })
    // this.easystar.calculate()
  }

}

export default fantasyState
