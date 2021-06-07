import React, { Component } from "react";
import Http from "../../Http";
import { Link, withRouter } from "react-router-dom";
import "./css/CategoryDetail.scss";
import CategoryList from "../category-list-component/CategoryListComponent";
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
        this.getProductsAndCategory();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.match.params.category_id !==
            prevProps.match.params.category_id
        ) {
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
                        <CategoryList categories={category.sub_categories} />
                        <div className="product-list">
                            <div className="container">
                                <div className="row">
                                    {products
                                        ? products.map((product, index) => (
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
                                          ))
                                        : ""}
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CategoryDetail)
);
