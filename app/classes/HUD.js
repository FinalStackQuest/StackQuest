require('pixi')
require('p2')
require('phaser')

// const HudElements = {

// }

class HUD extends Phaser.Group {
	constructor(game, player) {
		super(game)

		this.player = player
		this.HudElements = {}

		this.initHUD()

	    this.setAll('fixedToCamera', true)
	}

	updateHealth() {
		this.HudElements.currentHealth.setText(`HP: ${this.player.stats.hp}/ ${this.player.stats.maxHp}`)
	}

	initHUD() {
		this.HudElements.playerName = this.game.add.text(30, 25, `${this.player.name}`, {
	      font: '30px pixel',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

		this.HudElements.currentHealth = this.game.add.text(30, 70, `HP: ${this.player.stats.maxHp}/ ${this.player.stats.maxHp}`, {
	      font: '30px pixel',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    for (const elements in this.HudElements) {
	    	this.add(this.HudElements[elements])
	    }
	}

}

export default HUD