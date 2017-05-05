import React from 'react'
import PreloadState from '../game/preloader.js'
import TitleState from '../game/title.js'
import PlayState from '../game/play.js'
window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
const game = new Phaser.Game(640, 360, Phaser.AUTO)

class Game extends Phaser.Game {
	constructor() {
		super(640, 360, Phaser.AUTO)
		this.state.add('load', PreloadState)
		this.state.add('title', TitleState)
		this.state.add('play', PlayState)
		this.state.start('load')
	}
}