import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import StackQuestGame from '../game'
import Login from './Login'
import WhoAmI from './WhoAmI'
import Instructions from './Instructions'
import { whoami } from 'APP/app/reducers/auth'
import { showGameDisplay } from 'APP/app/reducers/game'
import { createCharacter } from 'APP/app/reducers/user'
import playerProps from 'APP/app/properties/playerProperties.json'

/* global StackQuest */

const Game = ({ loggedIn, gameExist, startGame }) =>
  <div id="game-container">
    {loggedIn && !gameExist &&
      <div>
        <Instructions />
        <button className="btn btn-primary" onClick={startGame}>Start Game</button>
      </div>
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
    // checks to make sure user and character information is updated in the store
    this.props.whoami()
    this.props.showGameDisplay(true)
    console.log(this.props.user)
    const character = this.props.user.character
    character.userName = this.props.user.userName

    StackQuest.game = new StackQuestGame()
    StackQuest.game.startGame(character)
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
  { showGameDisplay, whoami }
)(LocalContainer)

export default GameContainer
