'use strict'

import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import Root from './components/Root'
import Game from './components/Game'
import NotFound from './components/NotFound'

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Root}>
        <IndexRedirect to="/game" />
        <Route path="/game" component={Game} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
