'use strict'

import React from 'react'
import { connect } from 'react-redux'
import Login from './Login'
import WhoAmI from './WhoAmI'

const Root = ({ user, children }) =>
  <div>
    <nav>
      {user ? <WhoAmI /> : <Login />}
    </nav>
    {children}
  </div>

const RootContainer = connect(({ auth }) => ({ user: auth }))(Root)

export default RootContainer
