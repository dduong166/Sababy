import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Spin, Button, Modal, Form, Input, Cascader, InputNumber } from "antd";
import "./css/MyProducts.scss";
import { connect } from "react-redux";
import moment from "moment";
import AddProductComponent from "./AddProductComponent";

const { TextArea } = Input;

class MyProducts extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         visible: false,
    //         confirmLoading: false,
    //         category_id: null,
    //         product_name: null,
    //         description: null,
    //         price: null,
    //         quantity: 1,
    //         outside_status: null,
    //         function_status: null,
    //         modal_step: 1
    //     };
    //     this.setModalVisible = this.setModalVisible.bind(this);
    //     this.setConfirmLoading = this.setConfirmLoading.bind(this);
    //     this.handleOk = this.handleOk.bind(this);
    //     this.onChangeCategory = this.onChangeCategory.bind(this);
    //     this.onChangeProductName = this.onChangeProductName.bind(this);
    //     this.onChangeDescription = this.onChangeDescription.bind(this);
    //     this.onChangePrice = this.onChangePrice.bind(this);
    //     this.onChangeQuantity = this.onChangeQuantity.bind(this);
    //     this.onChangeOutsideStatus = this.onChangeOutsideStatus.bind(this);
    //     this.onChangeFunctionStatus = this.onChangeFunctionStatus.bind(this);
    //     this.changeModalStep = this.changeModalStep.bind(this);
    // }

    // onChangeCategory(value) {
    //     this.setState({ category_id: value[value.length - 1] });
    // }
    // onChangeProductName(e) {
    //     this.setState({ product_name: e.target.value });
    // }
    // onChangeDescription(e) {
    //     this.setState({ description: e.target.value });
    // }
    // onChangePrice(value) {
    //     this.setState({ price: value });
    // }
    // onChangeQuantity(value) {
    //     this.setState({ quantity: value });
    // }
    // onChangeOutsideStatus(e) {
    //     this.setState({ outside_status: e.target.value });
    // }
    // onChangeFunctionStatus(e) {
    //     this.setState({ function_status: e.target.value });
    // }
    // changeModalStep(step) {
    //     this.setState({ modal_step: step });
    // }

    // setModalVisible(status) {
    //     if (status === true && !this.props.categories) {
    //         const uri = "http://localhost:8000/api/category";
    //         Http.get(uri).then(response => {
    //             this.props.setCategories(response.data);
    //         });
    //     }
    //     this.setState({ visible: status });
    // }

    // setConfirmLoading(status) {
    //     this.setState({ confirmLoading: status });
    // }

    // handleOk() {
    //     this.setConfirmLoading(true);
    //     setTimeout(() => {
    //         this.setModalVisible(false);
    //         this.setConfirmLoading(false);
    //     }, 2000);
    //     console.log(this.state);
    // }
    render() {
        // let categories = this.props.categories;
        // if (categories) {
        //     categories = categories.map((category, index) => ({
        //         value: category.id,
        //         label: category.category_name,
        //         children: category.sub_categories.map(
        //             (sub_category, index) => ({
        //                 value: sub_category.id,
        //                 label: sub_category.category_name
        //             })
        //         )
        //     }));
        // }
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
                                <AddProductComponent />
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
        categories: state.categoryDetail.categories,
        products: state.productDetail.products,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCategories: categories => {
            dispatch({
                type: "SET_CATEGORIES",
                payload: categories
            });
        },
        setProducts: products => {
            dispatch({
                type: "SET_PRODUCTS",
                payload: products
            });
        },
        setBookmark: (bookmark, index) => {
            dispatch({
                type: "SET_BOOKMARK",
                payload: bookmark,
                index: index
            });
        },
        setUnbookmark: index => {
            dispatch({
                type: "SET_UNBOOKMARK",
                index: index
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProducts);
