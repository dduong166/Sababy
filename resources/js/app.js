require('./bootstrap');

import React from 'react'
import { render, Link, Redirect } from 'react-dom'
import {
  Router,
  Route,
  Switch
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Page from './components/users/Page'
import App from './components/page/App'

const history = createBrowserHistory();
render (
  <Router history={history}>
    <Switch>
       <App>
           <Route path='/' exact component={Page} />
           <Route path='/login' exact component={Login} />
           <Route path='/register' exact component={Register} />
      </App>
    </Switch>
  </Router>, document.getElementById('app'))