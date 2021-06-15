import React, { Component } from "react";
import Http from "../../Http";
import { Link, withRouter } from "react-router-dom";
import "./css/CategoryDetail.scss";
import CategoryList from "../category-list-component/CategoryListComponent";
import AddProductComponent from "../product/AddProductComponent";
import ProductCard from "../product/ProductCard";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import { Spin } from "antd";

const history = createBrowserHistory();

class CategoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.getProductsAndCategory = this.getProductsAndCategory.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.getProductsAndCategory();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.match.params.category_id !==
            prevProps.match.params.category_id
        ) {
            this.setState({ isLoading: true });
            this.getProductsAndCategory();
        }
    }

    getProductsAndCategory() {
        let uri =
            "http://localhost:8000/api/product/category/" +
            this.props.match.params.category_id;
        Http.get(uri)
            .then(response => {
                this.props.setCategoryDetail(response.data);
                this.setState({ isLoading: false });
            })
            .catch(error => console.log(error));
    }

    render() {
        var category = this.props.category_detail;
        var products = this.props.products;
        console.log(this.state);
        return (
            <div className="homepage-body fullscreen-min-height">
                {!this.state.isLoading && category ? (
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Trang chủ</Link>
                                </li>
                                {category.parent_category_id ? (
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={
                                                "/category/" +
                                                category.parent_category_id[0]
                                                    .id
                                            }
                                        >
                                            {
                                                category.parent_category_id[0]
                                                    .category_name
                                            }
                                        </Link>
                                    </li>
                                ) : (
                                    ""
                                )}
                                <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                >
                                    {category.category_name}
                                </li>
                            </ol>
                        </nav>
                        <div className="category-banner">
                            <h2>{category.category_name}</h2>
                        </div>
                        {category.sub_categories.length ? (
                            <React.Fragment>
                                <h3 className="light-title">
                                    DANH MỤC SẢN PHẨM
                                </h3>
                                <CategoryList
                                    categories={category.sub_categories}
                                />
                            </React.Fragment>
                        ) : null}

                        <div className="title-products-and-add d-flex justify-content-between">
                            <h3 className="light-title">TẤT CẢ SẢN PHẨM</h3>
                            <AddProductComponent />
                        </div>
                        <div className="product-list">
                            <div className="container">
                                <div className="row">
                                    {products.length
                                        ? products.map((product, index) => (
                                              <ProductCard
                                                  key={product.id}
                                                  product={product}
                                                  index={index}
                                              />
                                          ))
                                        : <p>Chưa có sản phẩm nào thuộc danh mục này.</p>}
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
        products: state.categoryDetail.products,
        category_detail: state.categoryDetail.category_detail
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCategoryDetail: detail => {
            dispatch({
                type: "SET_CATEGORY_DETAIL",
                payload: detail
            });
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CategoryDetail)
);
