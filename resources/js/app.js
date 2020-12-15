require('./bootstrap');

import React, { Component } from "react";
import ReactDOM from 'react-dom'
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { render, Link, Redirect } from 'react-dom'
import {
  Router,
  Route,
  Switch
} from 'react-router-dom'
import Http from './Http'
import { createBrowserHistory } from 'history'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Page from './components/users/Page'
import App from './components/page/App'
import Navbar from './components/header-footer/Navbar'


 const history = createBrowserHistory();

class AppMain extends Component {
  constructor() {
    super();
    this.state = {
      current_user: null,
      loading: true
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
    console.log("update state done!!!");
  }

  getUser() {
    console.log("App state: ", this.state);
    Http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage['auth_token'];
    Http.get('api/isLoggedIn').then((response) => {
      console.log("Current user(app): ", response);
      if (response.data.user) {
        this.setState({
          current_user: response.data.user.name,
          loading: false
        });
      } else {
        this.setState({
          current_user: null,
          loading: false
        });
      }
    }).catch((error) => {
      console.log(error.response.status)
    })
}

  render() {
    return (
      <Router history={history}>
      {!this.state.loading ? 
        <div className="app">
          <Switch>
            <App>
          <Navbar updateUser={this.updateUser} current_user={this.state.current_user} history={history} />
          <Route path='/' exact component={Page} />
          {/* <Route path='/login' exact component={Login} /> */}
          <Route
            path="/login"
            render={() => <Login updateUser={this.updateUser} history={history} />}
          />
          {/* <Route path="/auth/profile" render={() => <Profile current_user={this.state.current_user} />} /> */}
          </App> 
          </Switch>
        </div>
      : <></>}

      </Router>
      
    );
  }
}


export default AppMain;


if (document.getElementById('app')) {
    ReactDOM.render(<AppMain />, document.getElementById('app'));
}