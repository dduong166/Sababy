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
            defaultCurrent: 1,
            totalSellingItem: 1,
            totalSoldItem: 1,
            pageSize: 12
        };
        this.getSellingProducts = this.getSellingProducts.bind(this);
        this.getSoldProducts = this.getSoldProducts.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    componentDidMount() {
        this.getSellingProducts(this.state.defaultCurrent);
        this.getSoldProducts(this.state.defaultCurrent);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    getSellingProducts(page) {
        const selling = this.props.isAdminPage
            ? process.env.MIX_API_URL + "api/admin/selling?page=" + page
            : process.env.MIX_API_URL + "api/product/selling?page=" + page;
        Http.get(selling).then(response => {
            this.props.setProducts(response.data.data);
            this.setState({
                totalSellingItem: response.data.total
            })
        });
    }

    getSoldProducts(page) {
        const sold = this.props.isAdminPage
            ? process.env.MIX_API_URL + "api/admin/sold?page=" + page
            : process.env.MIX_API_URL + "api/product/sold?page=" + page;
        Http.get(sold).then(response => {
            this.props.setSoldProducts(response.data.data);
            this.setState({
                isLoading: false,
                totalSoldItem: response.data.total,
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
        console.log(this.state);
        return (
            <div className="my-products-page fullscreen-min-height container">
                {!this.props.isAdminPage ? (
                    <React.Fragment>
                        <div className="my-products-banner">
                            <h2>SẢN PHẨM</h2>
                        </div>
                        <AddProductComponent updateProductList={() => this.getSellingProducts(1)} />
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
                                                this.state.defaultCurrent
                                            }
                                            total={this.state.totalSellingItem}
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
                                                this.state.defaultCurrent
                                            }
                                            total={this.state.totalSoldItem}
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProducts);
