require('pixi')
require('p2')
require('phaser')

import { GameGroups, GamePlayers } from '../sockets'

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
    this.HUDElement.currentStats.setText(`ATK: ${this.player.weapon.damage()}/DEF: ${this.player.stats.defense + this.player.armor.defense}`)
  }

  updateNumPlayers() {
    this.HUDElement.numPlayers.setText(`Players in World: ${Object.keys(GamePlayers).length + 1}`)
  }

  updateScoreboard() {
    // add player names and score to array
    const playerScores = []
    for (const player in GamePlayers) {
      playerScores.push({name: player.name, score: player.lootCount})
    }
    playerScores.push({name: this.player.name, score: this.player.lootCount})
    // sort the array based on lootCount
    playerScores.sort((p1, p2) => p1.score > p2.score)
    // add these as text nodes to the

    // this.HUDElement.scoreboard =
  }

  updateFeed(newFeed) {
    this.HUDElement.currentFeed.setText(`${newFeed}`)
    setTimeout(() => this.HUDElement.currentFeed.setText(''), 4000)
  }

  initHUD() {
    const gameX = this.game.width
    const gameY = this.game.height
    // const sortedPlayers = GamePlayers.sort()
    for (const player in GamePlayers) {
      console.log('name: ', player.name)
      console.log('lootCount', player.lootCount)
    }
    console.log('GamePlayers', GamePlayers)

    this.HUDElement.playerName = this.game.add.text(30, 25, `NAME: ${this.player.name}`, {
      font: '15px Press Start 2P',
      fill: '#2a2029',
      strokeThickness: 1
    })

    this.HUDElement.currentHealth = this.game.add.text(30, 55, `HP: ${this.player.stats.hp}/${this.player.stats.maxHp}`, {
      font: '15px Press Start 2P',
      fill: '#2a2029',
      strokeThickness: 1
    })

    this.HUDElement.currentStats = this.game.add.text(30, 85, `ATK: ${this.player.weapon.damage()}/DEF: ${this.player.stats.defense + this.player.armor.defense}`, {
      font: '15px Press Start 2P',
      fill: '#2a2029',
      strokeThickness: 1
    })

    this.HUDElement.currentWeapon = this.game.add.text(30, 115, `WEAPON: ${this.player.weaponKey}`, {
      font: '15px Press Start 2P',
      fill: '#2a2029',
      strokeThickness: 1
    })

    this.HUDElement.numPlayers = this.game.add.text(30, 145, `Players in World: ${Object.keys(GamePlayers).length + 1}`, {
      font: '15px Press Start 2P',
      fill: '#2a2029',
      strokeThickness: 1
    })

    this.HUDElement.scoreboardTitle = this.game.add.text(600, 25, `Top 3 GREEDIEST Players`, {
      font: '15px Press Start 2P',
      fill: '#2a2029',
      strokeThickness: 1
    })

    this.HUDElement.currentFeed = this.game.add.text(gameX / 2, gameY - 35, `Welcome to StackQuest`, {
      font: '15px Press Start 2P',
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
