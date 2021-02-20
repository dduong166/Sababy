import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/CategoryDetail.scss";
import CategoryList from "../category-list-component/CategoryListComponent";
import ProductCard from "../product/ProductCard";
import { connect } from "react-redux";

class CategoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
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
                this.setState({ loading: false });
            })
            .catch(error => console.log(error));
    }

    render() {
        console.log(this.props);
        var category = this.props.detail.category;
        var products = this.props.detail.products;

        return (
            <div className="homepage-body">
                {!this.state.loading && category ? (
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
                        <CategoryList
                            parent_categories={category.sub_categories}
                        />
                        <div className="product-list">
                            <div className="container">
                                <div className="row">
                                    {products
                                        ? products.map(
                                              (product, index, products) => (
                                                  <ProductCard
                                                      key={product.id}
                                                      product={product}
                                                  />
                                              )
                                          )
                                        : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    "Loading..."
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        detail: state.categoryDetail.detail
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetail);
