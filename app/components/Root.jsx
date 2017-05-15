'use strict'

import React from 'react'
import { connect } from 'react-redux'
import Login from './Login'
import WhoAmI from './WhoAmI'

const Root = ({ user, game, children }) =>
  <div className={`${game ? 'black-background' : ''} root-container`}>
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">StackQuest</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            {user
              ? <li><WhoAmI /></li>
              : <ul className="nav navbar-nav">
                <li><a href="/signup"><span className="glyphicon glyphicon-user"></span> Register</a></li>
                <li><Login /></li>
              </ul>
            }
          </ul>
        </div>
      </div>
    </nav>
    <div className="stackquest-logo">
      <img src="/stackquest_logo.png" className="no-select" alt="stackquest_logo" />
    </div>
    {children}
    <footer className="footer footer-container">
      <div className="container">
        <div className="vcenter muted">
          <span className="glyphicon glyphicon-wrench" /> Created by <a href="https://github.com/FinalStackQuest/StackQuest">Team StackQuest</a>
        </div>
      </div>
    </footer>
  </div>

const RootContainer = connect(({ auth, game }) => ({ user: auth, game }))(Root)

export default RootContainer
