import React from 'react'
import {connect} from 'react-redux'

const GamePlay = ({game, user}) => (
  <div className='gameplay-container'>
    {!game && !user && <img className='game-play' src='gameplay.png' />}
  </div>
)

const GamePlayContainer = connect(({ game, auth }) => ({ game, user: auth }))(GamePlay)

export default GamePlayContainer
