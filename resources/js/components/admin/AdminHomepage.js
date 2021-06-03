import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/AdminHomepage.scss";
import Http from "../../Http";
import { Menu } from "antd";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import OverviewComponent from "./OverviewComponent";
import AccountComponent from "./AccountComponent";

class AdminHomepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tab: 1
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e) {
        this.setState({
            tab: e.key
        });
    }

    render() {
        console.log(this.state);
        return (
            <div className="admin-homepage">
                <Navbar />
                <div className="d-flex justify-content-start">
                    <Menu
                        onClick={e => this.handleMenuClick(e)}
                        style={{ width: 150 }}
                        defaultSelectedKeys={["1"]}
                        mode="inline"
                    >
                        <Menu.Item key="1">Tổng quan</Menu.Item>
                        <Menu.Item key="2">Tài khoản</Menu.Item>
                        <Menu.Item key="3">Sản phẩm</Menu.Item>
                    </Menu>
                    {this.state.tab == 1 ? (
                        <OverviewComponent />
                    ) : this.state.tab == 2 ? (
                        <AccountComponent />
                    ) : (
                        <div>tab 3 ne</div>
                    )}
                </div>
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AdminHomepage)
);
