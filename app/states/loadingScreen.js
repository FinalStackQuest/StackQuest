import loadMaps from './utils/loadMaps'

/* global StackQuest, Phaser */

let loadingText
  , player
  , nextState

export default {
  init(character) {
    player = character
    nextState = character.currentMap || 'fantasyState'
  },

  preload() {
    loadingText = this.game.add.text(this.world.width/2, this.world.height/2, '0% / 100%', {
      font: '65px Arial',
      fill: '#fff',
      align: 'center'
    })
    loadingText.anchor.setTo(0.5)

    for (const map in loadMaps) { 
      if (loadMaps.hasOwnProperty(map)) {
        loadMaps[map].call()
      }
    }

  },

  loadUpdate() {
    loadingText.setText(`${this.load.progress}% / 100%`)
  },

  create() {
    this.state.start(nextState, true, false, player)
  }
}
