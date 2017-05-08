'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'

import store from './store'
import Game from './components/Game'
import LoginPage from './components/LoginPage'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'

const Root = ({ user, children }) =>
  <div>
    <nav>
      {user ? <WhoAmI /> : <Login />}
    </nav>
    {children}
  </div>

const RootContainer = connect(({ auth }) => ({ user: auth }))(Root)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={RootContainer}>
        <IndexRedirect to="/login" />
        <Route path="/login" component={LoginPage} />
        <Route path="/game" component={Game} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
