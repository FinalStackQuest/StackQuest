require('pixi')
require('p2')
require('phaser')
import {GameGroups}from '../sockets'

// const HudElements = {

// }

class HUD {
	constructor(game, player) {
		this.game = game

		this.player = player
		this.HUDElement = {}
		this.initHUD()

	    GameGroups.HUD.setAll('fixedToCamera', true)
	}

	updateHealth() {
		this.HUDElement.currentHealth.setText(`HP: ${this.player.stats.hp}/${this.player.stats.maxHp}`)
	}

	updateWeapon() {
		this.HUDElement.currentWeapon.setText(`WEAPON: ${this.player.weaponKey}`)
	}

	updateStats() {
		this.HUDElement.currentStats.setText(`ATK: ${this.player.weapon.damage()} / DEF: ${this.player.stats.defense}`)
	}

	updateFeed(newFeed) {
		this.HUDElement.currentFeed.setText(`${newFeed}`)
	}

	initHUD() {
		const gameX = this.game.width
		const gameY = this.game.height

		this.HUDElement.playerName = this.game.add.text(30, 25, `NAME: ${this.player.name}`, {
	      font: '20px Press Start 2P',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

		this.HUDElement.currentHealth = this.game.add.text(30, 65, `HP: ${this.player.stats.maxHp}/${this.player.stats.maxHp}`, {
	      font: '20px Press Start 2P',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    this.HUDElement.currentStats = this.game.add.text(30, 105, `ATK: ${this.player.stats.attack} / DEF: ${this.player.stats.defense}`, {
	      font: '20px Press Start 2P',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    this.HUDElement.currentWeapon = this.game.add.text(30, 145, `WEAPON: ${this.player.weaponKey}`, {
	      font: '20px Press Start 2P',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })

	    this.HUDElement.currentFeed = this.game.add.text(gameX/2, gameY-40, `Cool, this is a feed`, {
	      font: '20px Press Start 2P',
	      fill: '#2a2029',
	      strokeThickness: 1
	    })
	    this.HUDElement.currentFeed.anchor.set(0.5)

	    for (const elements in this.HUDElement) {
	    	GameGroups.HUD.add(this.HUDElement[elements])
	    }
	}

}

export default HUD