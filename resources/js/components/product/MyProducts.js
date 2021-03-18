import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { connect } from "react-redux";
import moment from "moment";

class MyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            quantity: 1,
            question: "",
            answer: ""
        };
    }

    render() {
        return (
            <div className="my-products-page">
                sản phẩm của tôi đây nè
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProductDetail: detail => {
            dispatch({
                type: "SET_PRODUCT_DETAIL",
                payload: detail
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProducts);
