require("./bootstrap");

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import Http from "./Http";
import { createBrowserHistory } from "history";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducer/rootReducer";
import PrivateRoute from "./PrivateRoute";

import Login from "./components/auth/Login";
import AdminHomepage from "./components/admin/AdminHomepage";
import Homepage from "./components/homepage/Homepage";
import CategoryDetail from "./components/category-detail/CategoryDetail";
import ProductDetail from "./components/product/ProductDetail";
import ProductSearch from "./components/product/ProductSearch";
import App from "./components/page/App";
import Navbar from "./components/header-footer/Navbar";
import Footer from "./components/header-footer/Footer";
import MyProducts from "./components/product/MyProducts";

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
                    <Switch>
                        <Route path="/admin" component={AdminHomepage} />
                        <App>
                            <Navbar history={history} />
                            <Route path="/login" exact component={Login} />
                            <Route path="/" exact component={Homepage} />
                            <Route
                                path="/category/:category_id"
                                exact
                                component={CategoryDetail}
                            />
                            <Route
                                path="/product/:product_id"
                                exact
                                component={ProductDetail}
                            />
                            <Route
                                path="/search"
                                exact
                                component={ProductSearch}
                            />
                            <PrivateRoute
                                path="/my-products"
                                component={MyProducts}
                            />
                            <Footer />
                        </App>
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default AppMain;

if (document.getElementById("app")) {
    ReactDOM.render(<AppMain />, document.getElementById("app"));
}
