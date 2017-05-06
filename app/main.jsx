'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'

import store from './store'
import Game from './components/Game'
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
    </div>
  )

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Root}>
        <Route path="/game" component={Game} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
