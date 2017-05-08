import React from 'react'
import { connect } from 'react-redux'
import { logout } from 'APP/app/reducers/auth'
import { showGameDisplay } from 'APP/app/reducers/game'
import { socket } from 'APP/app/sockets'

const WhoAmI = ({ user, gameExist, logoutHandler }) => (
  <div className="whoami">
    <span className="whoami-user-name">{user && user.name}</span>
    <button className="logout" onClick={logoutHandler}>Logout</button>
  </div>
)

class LocalContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameExist: props.game
    }
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  componentWillReceiveProps({ game }) {
    if (game !== this.state.gameExist) this.setState({ gameExist: game })
  }

  logoutHandler() {
    if (StackQuest.game) {
      StackQuest.game.destroy()
      delete StackQuest.game
      socket.emit('removePlayer')
    }
    this.props.showGameDisplay(false)
    this.props.logout()
  }

  render() {
    return (
      <WhoAmI
        {...this.state}
        logoutHandler={this.logoutHandler}
      />
    )
  }
}

const WhoAmIContainer = connect(
  ({ auth, game }) => ({ user: auth, game: game }),
  { logout, showGameDisplay }
)(LocalContainer)

export default WhoAmIContainer
