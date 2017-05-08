import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import StackQuestGame from '../game'
import Login from './Login'
import WhoAmI from './WhoAmI'

const Game = ({ loggedIn, gameExist, startGame }) =>
  <div id="game_container">
    {loggedIn && !gameExist &&
      <button onClick={startGame}>Start Game</button>
    }
  </div>

class LocalContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: props.user,
      gameExist: false
    }
    this.startGame = this.startGame.bind(this)
  }

  componentWillReceiveProps({ user }) {
    if (user !== this.state.user) this.setState({ loggedIn: user })
  }

  startGame() {
    this.setState({ gameExist: true })
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

const GameContainer = connect(({ auth }) => ({ user: auth }))(LocalContainer)

export default GameContainer
