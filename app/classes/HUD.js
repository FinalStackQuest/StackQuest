require('pixi')
require('p2')
require('phaser')

// const HudElements = {

// }

class HUD extends Phaser.Group {
	constructor(game, player) {
		super(game)

		this.player = player
		this.HUDElement = {}

		this.initHUD()

	    this.setAll('fixedToCamera', true)
	}

	updateHealth() {
		this.HUDElement.currentHealth.setText(`HP: ${this.player.stats.hp}/ ${this.player.stats.maxHp}`)
	}

	updateWeapon() {
		this.HUDElement.currentWeapon.setText(`WEAPON: ${this.player.weaponKey}`)
	}

	updateStats() {
		this.HUDElement.currentStats.setText(`ATK: ${this.player.stats.attack} / DEF: ${this.player.stats.defense}`)
	}

	initHUD() {
		const gameY = this.game.height

		this.HUDElement.playerName = this.game.add.text(30, 25, `NAME: ${this.player.name}`, {
	      font: '25px pixel',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

		this.HUDElement.currentHealth = this.game.add.text(30, 65, `HP: ${this.player.stats.maxHp} / ${this.player.stats.maxHp}`, {
	      font: '25px pixel',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    this.HUDElement.currentStats = this.game.add.text(30, 105, `ATK: ${this.player.stats.attack} / DEF: ${this.player.stats.defense}`, {
	      font: '25px pixel',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    this.HUDElement.currentWeapon = this.game.add.text(30, 145, `WEAPON: ${this.player.weaponKey}`, {
	      font: '25px pixel',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    for (const elements in this.HUDElement) {
	    	this.add(this.HUDElement[elements])
	    }
	}

}

export default HUD