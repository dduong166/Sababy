import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/homepage.scss";
import ProductCard from "../product/ProductCard";
import CategoryList from "../category-list-component/CategoryListComponent";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
        this.getCategories = this.getCategories.bind(this);
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        let uri = "api/category";
        Http.get(uri).then(response => {
            this.setState({
                categories: response.data
            });
            console.log(this.state.categories);
        });
    }

    render() {
        let parent_categories = this.state.categories.filter(category => {
            return category.parent_category_id === null;
        });
        return (
            <div className="homepage-body">
                <div className="container">
                    <h3>DANH MỤC SẢN PHẨM</h3>
                    <CategoryList parent_categories = {parent_categories}/>
                    <h3 class="trending_title">THỊNH HÀNH</h3>
                    <div className="product-list">
                        <div className="container">
                            <div className="row">
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Homepage;
