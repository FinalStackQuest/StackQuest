import React from 'react'
import { connect } from 'react-redux'
import { logout } from 'APP/app/reducers/auth'
import { showGameDisplay } from 'APP/app/reducers/game'
import { socket } from 'APP/app/sockets'

const WhoAmI = ({ user, gameExist, logoutHandler }) => (
  <form className="nav navbar-form navbar-right whoami">
    <label className="col-sm-2 col-form-label col-form-label-sm whoami-user-name">{user && user.name}</label>
    <button className="btn my-2 my-sm-0 logout" onClick={logoutHandler}>Logout</button>
  </form>
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
