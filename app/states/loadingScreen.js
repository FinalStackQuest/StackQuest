import preloadTest from './preloadTest.js'

let loadingText

export default {
  preload() {
    loadingText = this.add.text(this.world.width/2, this.world.height/2, '0% / 100%', {
      font: '65px Arial',
      fill: '#fff',
      align: 'center'
    })
    loadingText.anchor.setTo(0.5, 1)
    this.load.tilemap('testmap', 'assets/maps/testmap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('terrainTiles', 'assets/tilesets/LPC_Terrain/terrain.png')
    this.load.image('baseOutAtlasTiles', 'assets/tilesets/Atlas/base_out_atlas.png')
  },
  loadUpdate() {
    loadingText.setText(`${this.load.progress}% / 100%`)
  },
  create() {
    this.state.start('preloadTest')
  },
}
