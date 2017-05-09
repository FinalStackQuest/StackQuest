'use strict'

import React from 'react'
import { connect } from 'react-redux'
import Login from './Login'
import WhoAmI from './WhoAmI'

const Root = ({ user, children }) =>
  <div>
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">StackQuest</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="/signup"><span className="glyphicon glyphicon-user"></span> Register</a></li>
            <li>{user ? <WhoAmI /> : <Login />}</li>
          </ul>
        </div>
      </div>
    </nav>
    {children}
  </div >

const RootContainer = connect(({ auth }) => ({ user: auth }))(Root)

export default RootContainer
