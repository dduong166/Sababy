import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductDetail.scss";
import { connect } from "react-redux";

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.getProductDetail = this.getProductDetail.bind(this);
    }

    componentDidMount() {
        this.getProductDetail();
    }

    getProductDetail(){
        let uri =
            "http://localhost:8000/api/product/" +
            this.props.match.params.product_id;
        Http.get(uri)
            .then(response => {
                this.props.setProductDetail(response.data);
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div className="product-card col-md-4">
                {this.props.detail.product_name} ahihi
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        detail: state.productDetail.detail
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProductDetail: (detail) => {
            dispatch({
                type: "SET_PRODUCT_DETAIL",
                payload: detail
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
