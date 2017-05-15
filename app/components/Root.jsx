'use strict'

import React from 'react'
import { connect } from 'react-redux'
import Navbar from './Navbar'
import Footer from './Footer'

const Root = ({ user, game, children }) =>
  <div className={`${game ? 'black-background' : ''} root-container`}>
    <Navbar user={user} />

    <div className="stackquest-logo">
      <img src="/stackquest_logo.png" className="no-select" alt="stackquest_logo" />
    </div>

    {children}

    <Footer />
  </div>

const RootContainer = connect(({ auth, game }) => ({ user: auth, game }))(Root)

export default RootContainer
