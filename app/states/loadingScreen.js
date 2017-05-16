import loadAssets from './utils/loadAssets'
import {loadClassSelect} from './utils/loadAssets'
import CustomLoader from '../utils/CustomLoader'

/* global StackQuest, Phaser */

let loadingText
  , player
  , nextState

export default {
  init(character) {
    player = character
    nextState = character.currentMap
    this.game.load = new CustomLoader(this.game)
  },

  preload() {
    this.game.load.webfont('Press Start 2P', 'Press Start 2P')

    loadingText = this.game.add.text(this.world.width / 2, this.world.height / 2, '0% / 100%', {
      font: '40px Press Start 2P',
      fill: '#fff',
      align: 'center'
    })

    loadingText.anchor.setTo(0.5)

    if (!player.class) {
      loadClassSelect()
    }

    loadAssets()
  },

  loadUpdate() {
    loadingText.setText(`${this.game.load.progress}% / 100%`)
  },

  create() {
    this.state.start(nextState, true, false, player)
  }
}
