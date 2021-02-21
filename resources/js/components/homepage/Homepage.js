import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/homepage.scss";
import ProductCard from "../product/ProductCard";
import CategoryList from "../category-list-component/CategoryListComponent";
import { connect } from "react-redux";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
        this.getCategories = this.getCategories.bind(this);
        this.getProducts = this.getProducts.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getProducts();
    }

    getCategories() {
        let uri = "http://localhost:8000/api/category";
        Http.get(uri).then(response => {
            // this.setState({
            //     categories: response.data
            // });
            this.props.setCategories(response.data);
        });
    }
    getProducts() {
        let uri = "http://localhost:8000/api/product";
        Http.get(uri).then(response => {
            // this.setState({
            //     categories: response.data
            // });
            this.props.setProducts(response.data);
        });
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
                <div className="container">
                    <h3>DANH MỤC SẢN PHẨM</h3>
                    <CategoryList parent_categories={parent_categories} />
                    <h3 className="trending_title">TẤT CẢ SẢN PHẨM</h3>
                    <div className="product-list">
                        <div className="container">
                            <div className="row">
                                {this.props.products
                                    ? this.props.products.map(
                                          (product, index) => (
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
