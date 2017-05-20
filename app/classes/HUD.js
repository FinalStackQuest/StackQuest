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

    this.scoreCategories = ['pvpCount', 'killCount', 'lootCount']
    this.boardVisibility = false
    this.HUDElements = {}

    this.initPlayerStats()
    this.initCountBoard()
    this.initLeaderBoard()

    Game.GameGroups.HUD.setAll('fixedToCamera', true)
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
    this.HUDElements.numPlayers.setText(`Players in Map: ${Object.keys(Game.GamePlayers).length + 1}`)
  }

  updateCount() {
    this.HUDElements.countBoard.pvpCount.setText(`Players Defeated: ${this.player.pvpCount}`)
    this.HUDElements.countBoard.killCount.setText(`Monsters Defeated: ${this.player.killCount}`)
    this.HUDElements.countBoard.lootCount.setText(`Loot Count: ${this.player.lootCount}`)
  }

  updateLeaderBoard(topPlayers) {
    for (const category of this.scoreCategories) {
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

    for (const category of this.scoreCategories) {
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
    this.HUDElements.numPlayers = this.game.add.text(30, 145, `Players in World: ${Object.keys(Game.GamePlayers).length + 1}`, textConfig)

    for (const elements in this.HUDElements) {
      Game.GameGroups.HUD.add(this.HUDElements[elements])
    }
  }

  initCountBoard() {
    const countBoard = {}

    const xCoord = 600
    let yCoord = 25
      , increment = 30

    const categories = this.scoreCategories
    const prefix = {
      pvpCount: 'Players Defeated:',
      killCount: 'Monsters Defeated:',
      lootCount: 'Loot Count:'
    }

    for (const category of categories) {
      const text = this.game.add.text(xCoord, yCoord, `${prefix[category]} ${this.player[category]}`, textConfig)
      text.visible = !this.boardVisibility

      countBoard[category] = text
      Game.GameGroups.HUD.add(text)

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

    const categories = this.scoreCategories
    const titles = {
      pvpCount: 'Top 3 PVP Players',
      killCount: 'Top 3 Hunters',
      lootCount: 'Top 3 Greediest'
    }

    for (const category of categories) {
      const titleText = this.game.add.text(xCoord, yCoord, titles[category], textConfig)
      titleText.visible = this.boardVisibility

      leaderBoard[`${category}Title`] = titleText
      Game.GameGroups.HUD.add(titleText)

      leaderBoard[category] = []
      yCoord += increment

      for (let i = 0; i < rankingSize; i++) {
        const textHolder = this.game.add.text(xCoord, yCoord, '', textConfig)
        textHolder.visible = this.boardVisibility

        leaderBoard[category].push(textHolder)
        Game.GameGroups.HUD.add(textHolder)
        yCoord += increment
      }
    }

    this.HUDElements.leaderBoard = leaderBoard
  }

}

export default HUD
