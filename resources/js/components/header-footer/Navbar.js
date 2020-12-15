import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/navbar.css";
import Http from "../../Http";

class Navbar extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     current_user: this.props.current_user
        // };
        this.logout = this.logout.bind(this);
    }
    componentDidMount() {
        console.log("navbar render, props: ", this.props);
    }

    logout() {
        this.props.updateUser({
            current_user: null
        });
        localStorage.removeItem("auth_token");
    }

    render() {
        return (
            <div>
                <header className="top-black-style">
                    <nav>
                        {this.props.current_user ? (
                            <ul>
                                <li className="special title">
                                    <img
                                        src="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1608021610/ca388fd6-d7c8-4ea3-a295-63865140cd51_200x200_1_gb46up.png"
                                        alt="logo"
                                    />
                                </li>
                                <div className="separation"></div>
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
                                    Hello {this.props.current_user}
                                </li>
                                <li className="special" onClick={this.logout}>
                                        LOGOUT
                                </li>
                            </ul>
                        ) : (
                            <ul>
                                <li className="special title">
                                    <img
                                        src="https://res.cloudinary.com/dbzfjnlhl/image/upload/v1608021610/ca388fd6-d7c8-4ea3-a295-63865140cd51_200x200_1_gb46up.png"
                                        alt="logo"
                                    />
                                </li>
                                <div className="separation"></div>
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

export default Navbar;
