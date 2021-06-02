import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/navbar.scss";
import Http from "../../Http";
import { connect } from "react-redux";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logoutAccount = this.logoutAccount.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
    }

    componentDidMount() {
        this.isLoggedIn();
    }

    isLoggedIn() {
        if (localStorage.getItem("auth_token")) {
            Http.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage["auth_token"];
            Http.get("http://localhost:8000/api/user/isLoggedIn")
                .then(response => {
                    if (response.data.user) {
                        var currentUser = {
                            id: response.data.user.id,
                            name: response.data.user.name
                        };
                        this.props.login(currentUser);
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
        return (
            <div className="navbar-section">
                <header className="top-black-style d-flex justify-content-between align-items-center">
                    <Link className="logo" to="/admin">
                        <img
                            src="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1613919232/27b6792e-38bd-471c-b46e-177a0e5a1af0_200x200_lb4mcd.png"
                            alt="logo"
                        />
                    </Link>

                    <div className="admin-navbar-title">
                        TRANG QUẢN LÝ SABABY
                    </div>

                    <div className="my-product-and-login-logout d-flex justify-content-start align-items-center">
                        <div className="login-logout">
                            {this.props.currentUser ? (
                                <div>
                                    <div className="username">
                                        Chào {this.props.currentUser.name}
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
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
