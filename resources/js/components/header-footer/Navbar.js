import React, { Component } from "react";
import { isEqual } from "lodash";
import { Link, withRouter } from "react-router-dom";
import "./css/navbar.scss";
import { Input } from "antd";
import Http from "../../Http";
import { connect } from "react-redux";
const queryString = require("query-string");

const { Search } = Input;
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            isLoading: true
        };
        this.logoutAccount = this.logoutAccount.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.isLoggedIn();
        const condition = queryString.parse(location.search);
        console.log(condition);
        if (condition.k) {
            this.setState({
                keyword: condition.k,
                isLoading: false
            });
        }else{
            this.setState({
                isLoading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname != "/search") {
            this.searchRef.setValue("");
        }
    }

    onSearch(value) {
        const condition = queryString.parse(location.search);
        if (!value) {
            if (condition.k) {
                delete condition.k;
            } else {
                return;
            }
        } else {
            condition.k = value;
        }
        condition.page = 1;
        let stringified = queryString.stringify(condition);
        if (stringified) stringified = "?" + stringified;
        this.props.history.push({
            pathname: "/search",
            search: stringified
        });
    }

    isLoggedIn() {
        if (localStorage.getItem("auth_token")) {
            Http.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage["auth_token"];
            Http.get("http://localhost:8000/api/user/isLoggedIn")
                .then(response => {
                    if (response.data.user) {
                        this.props.login(response.data.user);
                    } else {
                        this.props.logout();
                    }
                })
                .catch(error => {
                    console.log(error.response.status);
                    this.props.logout();
                });
        } else {
            console.log("k có auth_token trong Local Storage");
            this.props.logout();
        }
    }

    logoutAccount() {
        this.props.logout();
        localStorage.removeItem("auth_token");
    }

    render() {
        console.log(this.state);
        return (
            <div className="navbar-section">
                <header className="top-black-style d-flex justify-content-between align-items-center">
                    <Link className="logo" to="/">
                        <img
                            src="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1613919232/27b6792e-38bd-471c-b46e-177a0e5a1af0_200x200_lb4mcd.png"
                            alt="logo"
                        />
                    </Link>
                    <div className="searchbar">
                        {!this.state.isLoading ? (
                            <Search
                                ref={c => (this.searchRef = c)}
                                placeholder="Nhập tên sản phẩm"
                                allowClear
                                enterButton
                                defaultValue={this.state.keyword}
                                onSearch={this.onSearch}
                            />
                        ) : null}
                    </div>
                    <div className="my-product-and-login-logout d-flex justify-content-start align-items-center">
                        {this.props.currentUser ? (
                            <Link className="my-products" to="/my-products">
                                SẢN PHẨM CỦA TÔI
                            </Link>
                        ) : null}
                        <div className="login-logout">
                            {this.props.currentUser ? (
                                <div>
                                    <div className="username">
                                        <Link to="/profile">
                                            Chào {this.props.currentUser.name}
                                        </Link>
                                    </div>
                                    <div
                                        className="logout"
                                        onClick={this.logoutAccount}
                                    >
                                        Đăng xuất
                                    </div>
                                </div>
                            ) : (
                                <div className="special">
                                    <Link to="/login">Đăng nhập</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch({
                type: "LOGOUT"
            });
        },
        login: username => {
            dispatch({
                type: "LOGIN",
                payload: username
            });
        },
        setProducts: products => {
            dispatch({
                type: "SET_PRODUCTS",
                payload: products
            });
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
