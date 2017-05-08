import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import StackQuestGame from '../game'

const Game = ({ user }) =>
  <div>
    {user
      ? <div id="game_container">
        {StackQuest.game = new StackQuestGame()}
        {StackQuest.game.startGame()}
      </div>
      : browserHistory.push('/login')
    }
  </div>

const GameContainer = connect(({ auth }) => ({ user: auth }))(Game)

export default GameContainer
