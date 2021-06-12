import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/MyProducts.scss";
import { connect } from "react-redux";
import AddProductComponent from "./AddProductComponent";
import ProductCard from "./ProductCard";
import { Spin, Pagination } from "antd";

class MyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            isLoading: true,
            currentPage: 1,
            totalItem: 1,
            pageSize: 12
        };
        this.getSellingProducts = this.getSellingProducts.bind(this);
        this.getSoldProducts = this.getSoldProducts.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    componentDidMount() {
        this.getSellingProducts(this.state.currentPage);
        this.getSoldProducts(this.state.currentPage);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    getSellingProducts(page) {
        const selling = this.props.isAdminPage
            ? "http://localhost:8000/api/admin/selling?page=" + page
            : "http://localhost:8000/api/product/selling?page=" + page;
        Http.get(selling).then(response => {
            this.props.setProducts(response.data.data);
        });
    }

    getSoldProducts(page) {
        const sold = this.props.isAdminPage
            ? "http://localhost:8000/api/admin/sold?page=" + page
            : "http://localhost:8000/api/product/sold?page=" + page;
        Http.get(sold).then(response => {
            this.props.setSoldProducts(response.data.data);
            this.setState({
                isLoading: false,
                totalItem: response.data.total,
                pageSize: response.data.per_page
            });
        });
    }

    onPageChange(page) {
        this.getProducts(page);
    }

    render() {
        var products = this.props.products;
        var sold_products = this.props.sold_products;
        return (
            <div className="my-products-page fullscreen-min-height container">
                {!this.props.isAdminPage ? (
                    <React.Fragment>
                        <div className="my-products-banner">
                            <h2>SẢN PHẨM</h2>
                        </div>
                        <AddProductComponent />
                    </React.Fragment>
                ) : null}
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
                                    ĐÃ BÁN HẾT
                                </a>
                            </div>
                        </nav>
                        {!this.state.isLoading ? (
                            <div className="tab-content" id="nav-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="nav-onsale"
                                    role="tabpanel"
                                    aria-labelledby="nav-onsale-tab"
                                >
                                    <div className="product-list">
                                        <div className="container">
                                            <div className="row">
                                                {products
                                                    ? products.map(
                                                          (product, index) => (
                                                              <ProductCard
                                                                  key={
                                                                      product.id
                                                                  }
                                                                  product={
                                                                      product
                                                                  }
                                                                  index={index}
                                                                  myProduct={
                                                                      true
                                                                  }
                                                                  //   setBookmark={
                                                                  //       this.props.setBookmark
                                                                  //   }
                                                                  //   setUnbookmark={
                                                                  //       this.props.setUnbookmark
                                                                  //   }
                                                              />
                                                          )
                                                      )
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pagination d-flex justify-content-end">
                                        <Pagination
                                            defaultCurrent={
                                                this.state.currentPage
                                            }
                                            total={this.state.totalItem}
                                            pageSize={this.state.pageSize}
                                            onChange={page =>
                                                this.onPageChange(page)
                                            }
                                        />
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="nav-sold"
                                    role="tabpanel"
                                    aria-labelledby="nav-sold-tab"
                                >
                                    <div className="product-list">
                                        <div className="container">
                                            <div className="row">
                                                {sold_products
                                                    ? sold_products.map(
                                                          (product, index) => (
                                                              <ProductCard
                                                                  key={
                                                                      product.id
                                                                  }
                                                                  product={
                                                                      product
                                                                  }
                                                                  index={index}
                                                                  myProduct={
                                                                      true
                                                                  }
                                                                  soldProduct={
                                                                      true
                                                                  }
                                                                  //   setBookmark={
                                                                  //       this.props.setBookmark
                                                                  //   }
                                                                  //   setUnbookmark={
                                                                  //       this.props.setUnbookmark
                                                                  //   }
                                                              />
                                                          )
                                                      )
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pagination d-flex justify-content-end">
                                        <Pagination
                                            defaultCurrent={
                                                this.state.currentPage
                                            }
                                            total={this.state.totalItem}
                                            pageSize={this.state.pageSize}
                                            onChange={page =>
                                                this.onPageChange(page)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="loading d-flex justify-content-center align-items-center">
                                <Spin />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        products: state.productDetail.products,
        sold_products: state.productDetail.sold_products,
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
        setSoldProducts: products => {
            dispatch({
                type: "SET_SOLD_PRODUCTS",
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
