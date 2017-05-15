require('pixi')
require('p2')
require('phaser')

/* global Phaser */

const FontFaceObserver = require('fontfaceobserver')

export default class CustomLoader extends Phaser.Loader {
  webfont(key, fontName, overwrite) {
    if (typeof overwrite === 'undefined') {
      overwrite = false
    }
    this.addToFileList('webfont', key, fontName)
    return this
  }

  loadFile(file) {
    Phaser.Loader.prototype.loadFile.call(this, file)

    if (file.type === 'webfont') {
      const font = new FontFaceObserver(file.url)
      font.load(null, 10000)
        .then(() => {
          this.asyncComplete(file)
        }, () => {
          this.asyncComplete(file, 'Error loading font')
        })
    }
  }
}
