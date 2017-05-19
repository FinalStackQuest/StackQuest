
class Game {
	constructor () {
		this.GamePlayers = {}
		this.GameEnemies = {}
		this.GameItems = {}
		this.GameGroups = {}
		this.currentPlayer = null
		this.currentPlayerId = null
	}
}

export default new Game()