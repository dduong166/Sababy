import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/navbar.scss";
import Http from "../../Http";
import { connect } from "react-redux";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logoutAccount = this.logoutAccount.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
    }

    componentDidMount(){
        this.isLoggedIn();
    }

    isLoggedIn() {
        // console.log(localStorage.getItem("auth_token"));
        if (localStorage.getItem("auth_token")) {
            Http.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage["auth_token"];
            Http.get("http://localhost:8000/api/user/isLoggedIn")
                .then(response => {
                    // console.log(response);
                    if (response.data.user) {
                        var currentUser = {
                            id: response.data.user.id,
                            name: response.data.user.name
                        }
                        this.props.login(currentUser);
                    } 
                })
                .catch(error => {
                    console.log(error.response.status);
                });
        } else {
            console.log("k có auth_token trong Local Storage");
        }
    }

    logoutAccount() {
        this.props.logout();
        localStorage.removeItem("auth_token");
    }

    render() {
        return (
            <div className="navbar-section">
                <header className="top-black-style">
                    <nav>
                        {this.props.currentUser ? (
                            <ul>
                                <li className="special title">
                                    <a href="/">
                                        <img
                                            src="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1608021610/ca388fd6-d7c8-4ea3-a295-63865140cd51_200x200_1_gb46up.png"
                                            alt="logo"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <Link to="/" className="menu">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="auth/profile" className="menu">
                                        Profile
                                    </Link>
                                </li>
                                <li>Work</li>
                                <li>Portfolio</li>
                                <li>Contact</li>
                                <div className="separation"></div>
                                <li className="special">
                                    Hello {this.props.currentUser.name}
                                </li>
                                <li className="special" onClick={this.logoutAccount}>
                                    LOGOUT
                                </li>
                            </ul>
                        ) : (
                            <ul>
                                <li className="special title">
                                    <Link to="/">
                                        <img
                                            src="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1608021610/ca388fd6-d7c8-4ea3-a295-63865140cd51_200x200_1_gb46up.png"
                                            alt="logo"
                                        />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" className="menu">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="auth/profile" className="menu">
                                        Profile
                                    </Link>
                                </li>
                                <li>Work</li>
                                <li>Portfolio</li>
                                <li>Contact</li>
                                <div className="separation"></div>
                                <li>
                                    <Link to="/login" className="special">
                                        LOGIN
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </nav>
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
        login: (username) => {
            dispatch({
                type: "LOGIN",
                payload: username
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
