import fantasyState from './fantasyState.js'
let loadingText
  , player
  , nextMap

export default {
  init(character) {
    if (character) {
      nextMap = player.currentMap || 'fantasyState'
      player = character
    }
  },

  preload() {
    loadingText = this.add.text(this.world.width/2, this.world.height/2, '0% / 100%', {
      font: '65px Arial',
      fill: '#fff',
      align: 'center'
    })
    loadingText.anchor.setTo(0.5, 1)
    this.load.spritesheet('player', 'assets/tilesets/LPC_Terrain/terrain.png')
  },
  loadUpdate() {
    loadingText.setText(`${this.load.progress}% / 100%`)
  },
  create() {
  // this.state.start('preloadTest')
    this.state.start(player.currentMap, true, false, player)
  },
}
