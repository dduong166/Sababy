import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/CategoryDetail.scss";
import CategoryList from "../category-list-component/CategoryListComponent";
import ProductCard from "../product/ProductCard";

class CategoryDetail extends Component {
    constructor(props) {
        super(props);
        this.isComponentMounted = false;
        this.state = {
            categories: [],
            this_category: null,
            parent_category: null,
            sub_categories: null,
            products: null
        };
        this.getCategories = this.getCategories.bind(this);
        this.getProducts = this.getProducts.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getProducts();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.match.params.category_id !==
            prevProps.match.params.category_id
        ) {
            this.getCategories();
            this.getProducts();
        }
    }

    getCategories() {
        let uri = "http://localhost:8000/api/category";
        Http.get(uri)
            .then(response => {
                this.setState({
                    categories: response.data
                });
                var this_category_id = this.props.match.params.category_id; // this category
                var this_category = this.state.categories.filter(category => {
                    return category.category_id == this_category_id;
                });
                var parent_category = null; //parent category
                if (this_category[0].parent_category_id !== null) {
                    parent_category = this.state.categories.filter(category => {
                        return (
                            category.category_id ==
                            this_category[0].parent_category_id
                        );
                    });
                }
                var sub_categories = this.state.categories.filter(category => {
                    //sub category
                    return category.parent_category_id == this_category_id;
                });
                this.setState({
                    this_category: this_category,
                    parent_category: parent_category,
                    sub_categories: sub_categories
                });
            })
            .catch(error => console.log(error));
    }

    getProducts() {
        let uri =
            "http://localhost:8000/api/product/category/" +
            this.props.match.params.category_id;
        Http.get(uri)
            .then(response => {
                this.setState({
                    products: response.data
                });
                console.log("products: ", this.state.products);
            })
            .catch(error => console.log(error));
    } 

    render() {
        return (
            <div className="homepage-body">
                {this.state.this_category ? (
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Trang chủ</Link>
                                </li>
                                {this.state.parent_category ? (
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={
                                                "/category/" +
                                                this.state.parent_category[0]
                                                    .category_id
                                            }
                                        >
                                            {
                                                this.state.parent_category[0]
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
                                    {this.state.this_category[0].category_name}
                                </li>
                            </ol>
                        </nav>
                        <div className="category-banner">
                            <h2>{this.state.this_category[0].category_name}</h2>
                        </div>
                        <CategoryList
                            parent_categories={this.state.sub_categories}
                        />
                        <div className="product-list">
                            <div className="container">
                                <div className="row">
                                    {
                                        this.state.products ? this.state.products.map((product, index, products) => (
                                            <ProductCard product={product} />
                                        )) : ""
                                    }
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
export default CategoryDetail;
