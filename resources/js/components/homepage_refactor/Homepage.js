import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/homepage.scss";
import ProductCardRefactor from "../product_detail/ProductCardRefactor";

class HomepageRefactor extends Component {
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
                    <div className="category-list">
                        {parent_categories.map(
                            (category, index, categories) => (
                                <a
                                    href="https://www.furlenco.com/mumbai/bedroom-furniture-on-rent?ref=Home-Explore-Products-Bedroom"
                                    key={category.category_id}
                                >
                                    <div className="category-card">
                                        <img
                                            src={category.category_image_url}
                                        />
                                        <div className="category-card-title">
                                            {category.category_name}
                                        </div>
                                    </div>
                                </a>
                            )
                        )}
                    </div>
                    <h3 class="trending_title">THỊNH HÀNH</h3>
                    <div className="product-list">
                        <div className="container">
                            <div className="row">
                                <ProductCardRefactor />
                                <ProductCardRefactor />
                                <ProductCardRefactor />
                                <ProductCardRefactor />
                                <ProductCardRefactor />
                                <ProductCardRefactor />
                                <ProductCardRefactor />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default HomepageRefactor;
