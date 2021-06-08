import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/OverviewComponent.scss";
import Http from "../../Http";
import { Card, Spin } from "antd";
import { Line } from "@ant-design/charts";
import { connect } from "react-redux";

class OverviewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tab: 1,
            userByDate: [],
            totalUsers: null,
            productByDate: [],
            totalProducts: null
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    componentDidMount() {
        this.countUserByDate();
        this.countProductByDate();
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    handleMenuClick(e) {
        this.setState({
            tab: e.key
        });
    }

    countUserByDate() {
        const uri = "http://localhost:8000/api/admin/count_user";
        Http.get(uri).then(response => {
            this.setState({
                userByDate: response.data.userByDate,
                totalUsers: response.data.countAll
            });
        });
    }

    countProductByDate() {
        const uri = "http://localhost:8000/api/admin/count_product";
        Http.get(uri).then(response => {
            this.setState({
                productByDate: response.data.productByDate,
                totalProducts: response.data.countAll
            });
        });
    }

    render() {
        let data = this.state.userByDate;
        const user_config = {
            data,
            height: 300,
            width: 1000,
            xField: "date",
            yField: "người dùng",
            slider: {
                start: 0,
                end: 1
            },
            point: {
                size: 5,
                shape: "diamond"
            },
            label: {
                style: {
                    fill: "#aaa"
                }
            }
        };
        data = this.state.productByDate;
        const product_config = {
            data,
            height: 300,
            width: 1000,
            xField: "date",
            yField: "sản phẩm",
            slider: {
                start: 0,
                end: 1
            },
            point: {
                size: 5,
                shape: "diamond"
            },
            label: {
                style: {
                    fill: "#aaa"
                }
            }
        };
        console.log(product_config);
        return (
            <div className="admin-overview">
                <div className="total-users d-flex align-items-center">
                    <Card
                        title="Tổng số người dùng"
                        style={{ width: 200, textAlign: "center" }}
                    >
                        {this.state.totalUsers !== null ? (
                            this.state.totalUsers
                        ) : (
                            <Spin />
                        )}
                    </Card>
                    <Line {...user_config} />
                </div>
                <div className="total-products d-flex align-items-center">
                    <Card
                        title="Tổng số sản phẩm"
                        style={{ width: 200, textAlign: "center" }}
                    >
                        {this.state.totalProducts !== null ? (
                            this.state.totalProducts
                        ) : (
                            <Spin />
                        )}
                    </Card>
                    <Line {...product_config} />
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
    connect(mapStateToProps, mapDispatchToProps)(OverviewComponent)
);
