
class Game {
	constructor () {
		this.players = {}
		this.enemies = {}
		this.items = {}
		this.groups = {}
		this.currentPlayer = null
		this.currentPlayerId = null
	}
}

export default new Game()