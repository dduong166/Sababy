require("./bootstrap");

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import Http from "./Http";
import { createBrowserHistory } from "history";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducer/rootReducer";

import Login from "./components/auth/Login";
import Homepage from "./components/homepage/Homepage";
import CategoryDetail from "./components/category-detail/CategoryDetail";
import App from "./components/page/App";
import Navbar from "./components/header-footer/Navbar";
import Footer from "./components/header-footer/Footer";

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const history = createBrowserHistory();

class AppMain extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                        <div className="app">
                            <Switch>
                                <App>
                                    <Navbar
                                        history={history}
                                    />
                                    <Route
                                        path="/login"
                                        render={() => (
                                            <Login
                                                history={history}
                                            />
                                        )}
                                    />
                                    <Route
                                        path="/"
                                        exact
                                        component={Homepage}
                                    />
                                    <Route
                                        path="/category/:category_id"
                                        exact
                                        component={CategoryDetail}
                                    />
                                    <Footer />
                                </App>
                            </Switch>
                        </div>
                </Router>
            </Provider>
        );
    }
}

export default AppMain;

if (document.getElementById("app")) {
    ReactDOM.render(<AppMain />, document.getElementById("app"));
}
