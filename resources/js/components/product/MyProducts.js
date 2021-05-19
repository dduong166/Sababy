import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/MyProducts.scss";
import { connect } from "react-redux";
import AddProductComponent from "./AddProductComponent";
import ProductCard from "./ProductCard";

class MyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            isLoading: true
        };
        this.getProducts = this.getProducts.bind(this);
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        const uri = "http://localhost:8000/api/product/selling";
        Http.get(uri).then(response => {
            this.props.setProducts(response.data);
        });
    }

    render() {
        var products = this.props.products;

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
                                <div className="product-list">
                            <div className="container">
                                <div className="row">
                                    {products
                                        ? products.map((product, index) => (
                                              <ProductCard
                                                  key={product.id}
                                                  product={product}
                                                  index={index}
                                                //   setBookmark={
                                                //       this.props.setBookmark
                                                //   }
                                                //   setUnbookmark={
                                                //       this.props.setUnbookmark
                                                //   }
                                              />
                                          ))
                                        : ""}
                                </div>
                            </div>
                        </div>
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
