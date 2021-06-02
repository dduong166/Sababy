import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/AdminHomepage.scss";
import Http from "../../Http";
import { connect } from "react-redux";
import Navbar from "./Navbar";

class AdminHomepage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="admin-homepage">
                <Navbar />
                ahihihi
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminHomepage));
