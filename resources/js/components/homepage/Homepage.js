import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/homepage.scss";
import { Spin, Pagination } from "antd";
import ProductCard from "../product/ProductCard";
import AddProductComponent from "../product/AddProductComponent";
import CategoryList from "../category-list-component/CategoryListComponent";
import { connect } from "react-redux";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            defaultCurrent: 1,
            totalItem: 1,
            pageSize: 12,
            isLoading: true,
            isProductLoading: true
        };
        this.getCategories = this.getCategories.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.setIsProductLoading = this.setIsProductLoading.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.categories) {
            this.getCategories();
        }
        this.getProducts(this.state.defaultCurrent); //pagination page=1
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    setIsProductLoading(status) {
        this.setState({
            isProductLoading: status
        });
    }

    getCategories() {
        const uri = process.env.MIX_API_URL + "api/category";
        // const uri = process.env.REACT_APP_API_URL + "/api/product?page=" + page;
        console.log(process.env.MIX_API_URL);
        Http.get(uri).then(response => {
            this.props.setCategories(response.data);
        });
    }
    getProducts(page) {
        this.setIsProductLoading(true);
        const uri = process.env.MIX_API_URL + "api/product?page=" + page;
        Http.get(uri).then(response => {
            this.props.setProducts(response.data.data);
            this.setState({
                isLoading: false,
                isProductLoading: false,
                totalItem: response.data.total,
                pageSize: response.data.per_page
            });
        });
    }

    onPageChange(page) {
        this.getProducts(page);
    }

    render() {
        console.log(this.state);
        return (
            <div className="homepage-body fullscreen-min-height">
                {!this.state.isLoading ? (
                    <div className="container">
                        <h3 className="light-title">カテゴリー</h3>
                        <CategoryList categories={this.props.categories} />
                        <div className="title-products-and-add d-flex justify-content-between">
                            <h3 className="light-title">すべて</h3>
                            <AddProductComponent updateProductList={() => this.getProducts(1)} />
                        </div>
                        <div className="product-list">
                            <div className="container">
                                <div className="row">
                                    {!this.state.IsProductLoading &&
                                    this.props.products ? (
                                        this.props.products.map(
                                            (product, index) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    index={index}
                                                />
                                            )
                                        )
                                    ) : (
                                        <div className="loading d-flex justify-content-center align-items-center">
                                            <Spin />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pagination d-flex justify-content-end">
                            <Pagination
                                defaultCurrent={this.state.defaultCurrent}
                                total={this.state.totalItem}
                                pageSize={this.state.pageSize}
                                onChange={page => this.onPageChange(page)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="loading d-flex justify-content-center align-items-center">
                        <Spin />
                    </div>
                )}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        categories: state.categoryDetail.categories,
        products: state.productDetail.products
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
