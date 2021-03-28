import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import "./css/MyProducts.scss";
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
            <div className="my-products-page container">
                <div className="my-products-banner">
                    <h2>SẢN PHẨM</h2>
                </div>
                <div className="product-detail-info row">
                    <div className="col-lg-12">
                        <nav>
                            <div
                                className="nav nav-tabs nav-fill"
                                id="nav-tab"
                                role="tablist"
                            >
                                <a
                                    className="nav-item nav-link active"
                                    id="nav-onsale-tab"
                                    data-toggle="tab"
                                    href="#nav-onsale"
                                    role="tab"
                                    aria-controls="nav-onsale"
                                    aria-selected="true"
                                >
                                    ĐANG RAO BÁN
                                </a>
                                <a
                                    className="nav-item nav-link"
                                    id="nav-sold-tab"
                                    data-toggle="tab"
                                    href="#nav-sold"
                                    role="tab"
                                    aria-controls="nav-sold"
                                    aria-selected="false"
                                >
                                    ĐÃ BÁN
                                </a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="nav-onsale"
                                role="tabpanel"
                                aria-labelledby="nav-onsale-tab"
                            >
                                ahihihi
                            </div>
                            <div
                                className="tab-pane fade"
                                id="nav-sold"
                                role="tabpanel"
                                aria-labelledby="nav-sold-tab"
                            >
                                blah blha
                            </div>
                        </div>
                    </div>
                </div>
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
