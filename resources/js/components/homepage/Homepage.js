import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/homepage.scss";
import { Spin } from "antd";
import ProductCard from "../product/ProductCard";
import CategoryList from "../category-list-component/CategoryListComponent";
import { connect } from "react-redux";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            isLoading: true,
            isProductLoading: true
        };
        this.getCategories = this.getCategories.bind(this);
        this.getProducts = this.getProducts.bind(this);
        // this.getProductsWithDistance = this.getProductsWithDistance.bind(this);
        this.setIsProductLoading = this.setIsProductLoading.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getProducts();
    }

    setIsProductLoading(status) {
        this.setState({
            isProductLoading: status
        });
    }

    getCategories() {
        const uri = "http://localhost:8000/api/category";
        Http.get(uri).then(response => {
            this.props.setCategories(response.data);
        });
    }
    getProducts() {
        const uri = "http://localhost:8000/api/product";
        Http.get(uri).then(response => {
            this.props.setProducts(response.data);
            this.setState({ isLoading: false, isProductLoading: false });
        });
    }
    // getProductsWithDistance(products) {
    //     this.props.setProducts(products);
    // }
    handleBookmark(bookmark, index) {
        console.log("handle Bookmark");
        console.log(index);
        console.log(this.props);
        // this.props.setBookmark(bookmark, index);
    }

    render() {
        let parent_categories = [];
        if (this.props.categories) {
            parent_categories = this.props.categories.filter(category => {
                return category.parent_category_id === null;
            });
        }
        return (
            <div className="homepage-body">
                {!this.state.isLoading ? (
                    <div className="container">
                        {/* {this.props.products ? (
                            <div className="filter-and-sort d-flex justify-content-end">
                                <DistanceSort
                                    setProducts={this.props.setProducts}
                                />
                            </div>
                        ) : null} */}

                        <h3>DANH MỤC SẢN PHẨM</h3>
                        <CategoryList parent_categories={parent_categories} />
                        <h3 className="trending_title">TẤT CẢ SẢN PHẨM</h3>
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
                                                    setBookmark={
                                                        this.props.setBookmark
                                                    }
                                                    setUnbookmark={
                                                        this.props.setUnbookmark
                                                    }
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
        setUnbookmark: (index) => {
            dispatch({
                type: "SET_UNBOOKMARK",
                index: index
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
