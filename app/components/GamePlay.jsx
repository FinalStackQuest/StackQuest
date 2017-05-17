import React from 'react'
import {connect} from 'react-redux'

const GamePlay = ({game}) => (
  <div className='gameplay-container'>
    {!game && <img className='game-play' src='gameplay.png' />}
  </div>
)


const GamePlayContainer = connect(({ game }) => ({ game }))(GamePlay)

export default GamePlayContainer
