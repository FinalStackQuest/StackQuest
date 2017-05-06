'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'

import store from './store'
import { startGame } from './game'
import Jokes from './components/Jokes'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

const Root = connect(
  ({ auth }) => ({ user: auth })
)(
  ({ user }) =>
    <div>
      <nav>
        {user ? <WhoAmI /> : <Login />}
      </nav>
      <div id="game_container">
        {user && startGame()}
      </div>
    </div>
  )

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Root} />
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
