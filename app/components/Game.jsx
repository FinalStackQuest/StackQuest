import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import StackQuestGame from '../game'
import Login from './Login'
import WhoAmI from './WhoAmI'
import Instructions from './Instructions'
import GamePlay from './GamePlay'
import Chat from './Chat'
import { whoami } from 'APP/app/reducers/auth'
import { showGameDisplay } from 'APP/app/reducers/game'
import { createCharacter } from 'APP/app/reducers/user'
import playerProps from 'APP/app/properties/playerProperties.json'

/* global StackQuest */

const Game = ({ user, game, startGame }) =>
  <div id="game-chat-container">
    {user && !game &&
      <div className="start-game-container">
        <Instructions />
        <button className="btn btn-primary" onClick={startGame}>Start Game</button>
      </div>
    }
    <div id="game-container">
      <GamePlay />
      <Chat />
    </div>
  </div>

class LocalContainer extends React.Component {
  constructor() {
    super()

    this.startGame = this.startGame.bind(this)
  }

  startGame() {
    // checks to make sure user and character information is updated in the store
    this.props.whoami()
    this.props.showGameDisplay(true)
    const character = this.props.user.character
    character.userName = this.props.user.userName

    StackQuest.game = new StackQuestGame()
    StackQuest.game.startGame(character)
  }

  render() {
    return (
      <Game
        {...this.state}
        user={this.props.user}
        game={this.props.game}
        startGame={this.startGame}
      />
    )
  }
}

const GameContainer = connect(
  ({ auth, game }) => ({ user: auth, game }),
  { showGameDisplay, whoami }
)(LocalContainer)

export default GameContainer
