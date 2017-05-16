import React, { PropTypes } from 'react'

const Instructions = (props) => {
  return (
    <div>
      <ul className="list-group">
        <li className ="list-group-item">Aim - mouse</li>
        <li className="list-group-item">Attack - Left Mouse Button</li>
        <li className="list-group-item">Toggle Leaderboards - B</li>
        <li className="list-group-item">Up - W</li>
        <li className="list-group-item">Left - A</li>
        <li className="list-group-item">Down - S</li>
        <li className="list-group-item">Right - D</li>
      </ul>
    </div>
  )
}

export default Instructions
