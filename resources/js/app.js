require("./bootstrap");

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { render, Link, Redirect } from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import Http from "./Http";
import { createBrowserHistory } from "history";

import Login from "./components/auth/Login";
import Homepage from "./components/homepage/Homepage";
import CategoryDetail from "./components/category-detail/CategoryDetail";
// import ProductDetail from "./components/product/ProductDetail";
import App from "./components/page/App"; 
import Navbar from "./components/header-footer/Navbar";
import Footer from "./components/header-footer/Footer";

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
    }

    getUser() {
        console.log("App state: ", this.state);
        if (localStorage.getItem("auth_token")) {
            Http.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage["auth_token"];
            Http.get("api/user/isLoggedIn")
                .then(response => {
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
                })
                .catch(error => {
                    console.log(error.response.status);
                    this.setState({
                        current_user: null,
                        loading: false
                    });
                });
        }else{
          this.setState({
            current_user: null,
            loading: false
        });
        }
    }

    render() {
        return (
            <Router history={history}>
                {!this.state.loading ? (
                    <div className="app">
                        <Switch>
                            <App>
                                <Navbar
                                    updateUser={this.updateUser}
                                    current_user={this.state.current_user}
                                    history={history}
                                />
                                <Route
                                    path="/login"
                                    render={() => (
                                        <Login
                                            updateUser={this.updateUser}
                                            history={history}
                                        />
                                    )}
                                />
                                <Route path="/" exact component={Homepage}/>
                                <Route path="/category/:category_id" exact component={CategoryDetail} />
                                {/* <Route path="/product/:product_id" exact component={ProductDetail} /> */}
                                <Footer/>
                            </App>
                        </Switch>
                    </div>
                ) : (
                    <></>
                )}
            </Router>
        );
    }
}

export default AppMain;

if (document.getElementById("app")) {
    ReactDOM.render(<AppMain />, document.getElementById("app"));
}
