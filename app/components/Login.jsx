import React from 'react'
import { login } from 'APP/app/reducers/auth'
import { connect } from 'react-redux'

const Login = ({ login }) => (
  <form className="nav navbar-form navbar-right" onSubmit={evt => {
    evt.preventDefault()
    login(evt.target.username.value, evt.target.password.value)
  }}>
    <div className="input-group login-input">
      <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
      <input className="form-control mr-sm-2" placeholder="email" name="username" type="email" />
    </div>
    <div className="input-group login-input">
      <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
      <input className="form-control mr-sm-2" placeholder="password" name="password" type="password" />
    </div>
    <input className="btn my-2 my-sm-0" type="submit" value="Login" />
  </form>
)

const LoginContainer = connect(() => ({}), { login })(Login)

export default LoginContainer
