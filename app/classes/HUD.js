require('pixi')
require('p2')
require('phaser')

import store from 'APP/app/store'
import Game from './Game'
import { addMessage } from 'APP/app/reducers/chat'

 const textConfig = {
    font: '15px Press Start 2P',
    fill: '#fff',
    strokeThickness: 1
  }

class HUD {
  constructor(game, player) {
    this.game = game
    this.player = player

    this.boardVisibility = false
    this.HUDElements = {}
    this.setScoreCategories()

    this.initPlayerStats()
    this.initCountBoard()
    this.initLeaderBoard()

    Game.groups.HUD.setAll('fixedToCamera', true)
  }

  setScoreCategories() {
    this.scoreCategories = ['pvpCount', 'killCount', 'lootCount']
    this.categoryTexts =  {
      pvpCount: {
        title: 'Top 3 PVP Players',
        prefix: 'Players Defeated:'
      }, 
      killCount: {
        title: 'Top 3 Hunters',
        prefix: 'Monsters Defeated:'
      }, 
      lootCount: {
        title: 'Top 3 Greediest',
        prefix: 'Loot Count:'
      }
    }
  }

  updateHealth() {
    this.HUDElements.currentHealth.setText(`HP: ${this.player.stats.hp}/${this.player.stats.maxHp}`)
  }

  updateWeapon() {
    this.HUDElements.currentWeapon.setText(`WEAPON: ${this.player.weaponKey}`)
  }
  updateStats() {
    this.HUDElements.currentStats.setText(`ATK: ${this.player.stats.attack + this.player.weapon.attack}/DEF: ${this.player.stats.defense + this.player.armor.defense}`)
  }

  updateNumPlayers() {
    this.HUDElements.numPlayers.setText(`Players in Map: ${Object.keys(Game.players).length}`)
  }

  updateCount() {
    this.HUDElements.countBoard.pvpCount.setText(`Players Defeated: ${this.player.pvpCount}`)
    this.HUDElements.countBoard.killCount.setText(`Monsters Defeated: ${this.player.killCount}`)
    this.HUDElements.countBoard.lootCount.setText(`Loot Count: ${this.player.lootCount}`)
  }

  updateLeaderBoard(topPlayers) {
    const categories = Object.keys(this.scoreCategories)

    for (const category of categories) {
      const categoryLeaders = topPlayers[category]  
      categoryLeaders.forEach((player, i) => {
        const playerName = player.userName.length < 16 ? player.userName : player.userName.slice(0, 16)
        this.HUDElements.leaderBoard[category][i].setText(`${playerName} : ${player[category]}`)
      }, this)
    }
  }

  updateFeed(newFeed) {
    store.dispatch(addMessage(newFeed))
  }

  toggleBoards() {
    this.boardVisibility = !this.boardVisibility

    const categories = Object.keys(this.scoreCategories)

    for (const category of categories) {
      this.HUDElements.countBoard[category].visible = !this.boardVisibility
      this.HUDElements.leaderBoard[`${category}Title`].visible = this.boardVisibility
      this.HUDElements.leaderBoard[category].forEach(textNode => textNode.visible = this.boardVisibility, this)
    }
  }

  initPlayerStats() {

    this.HUDElements.playerName = this.game.add.text(30, 25, `NAME: ${this.player.name}`, textConfig)
    this.HUDElements.currentHealth = this.game.add.text(30, 55, `HP: ${this.player.stats.hp}/${this.player.stats.maxHp}`, textConfig)
    this.HUDElements.currentStats = this.game.add.text(30, 85, `ATK: ${this.player.stats.attack + this.player.weapon.attack}/DEF: ${this.player.stats.defense + this.player.armor.defense}`, textConfig)
    this.HUDElements.currentWeapon = this.game.add.text(30, 115, `WEAPON: ${this.player.weaponKey}`, textConfig)
    this.HUDElements.numPlayers = this.game.add.text(30, 145, `Players in World: ${Object.keys(Game.players).length}`, textConfig)

    for (const elements in this.HUDElements) {
      Game.groups.HUD.add(this.HUDElements[elements])
    }
  }

  initCountBoard() {
    const countBoard = {}

    const xCoord = 600
    let yCoord = 25
      , increment = 30

    const categories = Object.keys(this.scoreCategories)

    for (const category of categories) {
      const text = this.game.add.text(xCoord, yCoord, `${this.scoreCategories[category].prefix} ${this.player[category]}`, textConfig)
      text.visible = !this.boardVisibility

      countBoard[category] = text
      Game.groups.HUD.add(text)

      yCoord += increment
    }

    this.HUDElements.countBoard = countBoard
  }

  initLeaderBoard() {
    const leaderBoard = {}

    const xCoord = 600
    let yCoord = 25
      , increment = 30
      , rankingSize = 3

    const categories = Object.keys(this.scoreCategories)

    for (const category of categories) {
      const titleText = this.game.add.text(xCoord, yCoord, this.scoreCategories[category].title, textConfig)
      titleText.visible = this.boardVisibility

      leaderBoard[`${category}Title`] = titleText
      Game.groups.HUD.add(titleText)

      leaderBoard[category] = []
      yCoord += increment

      for (let i = 0; i < rankingSize; i++) {
        const textHolder = this.game.add.text(xCoord, yCoord, '', textConfig)
        textHolder.visible = this.boardVisibility

        leaderBoard[category].push(textHolder)
        Game.groups.HUD.add(textHolder)
        yCoord += increment
      }
    }

    this.HUDElements.leaderBoard = leaderBoard
  }

}

export default HUD
