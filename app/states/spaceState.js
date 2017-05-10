import { GamePlayers, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import buildMaps from './utils/buildMaps'
import createPlayer from './utils/createPlayer'
import createProjectile from './utils/createProjectile'
import playerMovement from './utils/playerMovement'
import playerAttack from './utils/playerAttack'
import mapTransition from './utils/mapTransition'

let cursors
  , playerObject
  , player

const spaceState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.space()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    buildMaps.space()

    socket.emit('setupState', player, 'spaceState')

    playerObject = createPlayer(player)

    const projectile = createProjectile.bullet(playerObject)

    this.physics.setBoundsToWorld(true, true, true, true, false)

    cursors = this.input.keyboard.createCursorKeys()

    StackQuest.game.input.onDown.add((pointer, mouseEvent) => playerAttack(pointer, mouseEvent, playerObject, projectile), this)
  },

  update() {
    playerMovement(playerObject, cursors)
    mapTransition(player, playerObject, 'fantasyState')
  },

  render() {
    this.game.debug.cameraInfo(this.camera, 32, 32)
  }
}

export default spaceState
