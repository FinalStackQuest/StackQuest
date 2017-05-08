import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Login from './Login'

const LoginPage = ({ user }) =>
  <div>
    {user
      ? browserHistory.push('/game')
      : <Login />
    }
  </div>

const LoginPageContainer = connect(({ auth }) => ({ user: auth }))(LoginPage)

export default LoginPageContainer
