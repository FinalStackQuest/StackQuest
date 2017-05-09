import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import StackQuestGame from '../game'
import Login from './Login'
import WhoAmI from './WhoAmI'
import { showGameDisplay } from 'APP/app/reducers/game'

const Game = ({ loggedIn, gameExist, startGame }) =>
  <div id="game-container">
    {loggedIn && !gameExist &&
      <button onClick={startGame}>Start Game</button>
    }
  </div>

class LocalContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: props.user,
      gameExist: props.game
    }
    this.startGame = this.startGame.bind(this)
  }

  componentWillReceiveProps({ user, game }) {
    if (user !== this.state.loggedIn) this.setState({ loggedIn: user })
    if (game !== this.state.gameExist) this.setState({ gameExist: game })
  }

  startGame() {
    this.props.showGameDisplay(true)
    StackQuest.game = new StackQuestGame()
    StackQuest.game.startGame()
  }

  render() {
    return (
      <Game
        {...this.state}
        startGame={this.startGame}
      />
    )
  }
}

const GameContainer = connect(
  ({ auth, game }) => ({ user: auth, game: game }),
  { showGameDisplay }
)(LocalContainer)

export default GameContainer
