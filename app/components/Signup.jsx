import React from 'react'
import { connect } from 'react-redux'
import { register } from 'APP/app/reducers/user'

const Signup = ({ user, register, userNameChangeHandler, emailChangeHandler, passwordChangeHandler, submitHandler }) => (
  <div className="container signup-container">
    {user
      ? <div><h3>You are already signed in.</h3></div>
      : <form className="form-horizontal" onSubmit={submitHandler}>
        <fieldset>
          <div id="legend">
            <legend className="register-text">Register</legend>
          </div>
          <div className="control-group input-group">
            <label className="control-label register-text">Username</label>
            <div className="controls">
              <input type="text" name="username" placeholder="" className="form-control input-lg" onChange={userNameChangeHandler} />
            </div>
          </div>

          <div className="control-group input-group">
            <label className="control-label register-text">E-mail</label>
            <div className="controls">
              <input type="text" name="email" placeholder="" className="form-control input-lg" onChange={emailChangeHandler} />
            </div>
          </div>

          <div className="control-group input-group">
            <label className="control-label register-text">Password</label>
            <div className="controls">
              <input type="password" name="password" placeholder="" className="form-control input-lg" onChange={passwordChangeHandler} />
            </div>
          </div>

          <div className="control-group input-group">
            <div className="controls">
              <button className="btn btn-success" type="submit">Register</button>
            </div>
          </div>
        </fieldset>
      </form>
    }
  </div>
)

class LocalContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      userName: '',
      email: '',
      password: ''
    }
    this.userNameChangeHandler = this.userNameChangeHandler.bind(this)
    this.emailChangeHandler = this.emailChangeHandler.bind(this)
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }

  userNameChangeHandler(event) {
    this.setState({ userName: event.target.value })
  }

  emailChangeHandler(event) {
    this.setState({ email: event.target.value })
  }

  passwordChangeHandler(event) {
    this.setState({ password: event.target.value })
  }

  submitHandler(event) {
    event.preventDefault()
    this.props.register({
      userName: this.state.userName,
      email: this.state.email,
      password: this.state.password
    })
  }

  render() {
    return (
      <Signup
        {...this.props}
        userNameChangeHandler={this.userNameChangeHandler}
        emailChangeHandler={this.emailChangeHandler}
        passwordChangeHandler={this.passwordChangeHandler}
        submitHandler={this.submitHandler}
      />
    )
  }
}

const SignupContainer = connect(({ auth }) => ({ user: auth }), { register })(LocalContainer)

export default SignupContainer
