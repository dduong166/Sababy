import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/homepage.css";
import ProductCard from "../product_detail/ProductCard";

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
            <div className="home-wrapper">
                <div className="widget-container">
                    <div>
                        <div className="position-relative">
                            <div className="h-100">
                                <ul className="tab-pro-body-container position-relative">
                                    <li className="d-flex flex-column position-relative">
                                        <div className="position-absolute w-100 animation anm-appear">
                                        <div className="container"><h3>DANH MỤC SẢN PHẨM</h3></div>
                                            
                                            <section className="category-links d-flex align-items-center background-white">
                                                <div className="container">
                                                    <div className="menu-container">
                                                        <div className="menu-links-container d-flex justify-content-center">
                                                            {parent_categories.map(
                                                                (
                                                                    category,
                                                                    index,
                                                                    categories
                                                                ) => (
                                                                    <a
                                                                        href="https://www.furlenco.com/mumbai/bedroom-furniture-on-rent?ref=Home-Explore-Products-Bedroom"
                                                                        key={
                                                                            category.category_id
                                                                        }
                                                                    >
                                                                        <div className="cursor-pointer menu-link d-flex margin-r-m">
                                                                            <div className="mini-card d-flex flex-column align-items-center justify-content-center">
                                                                                {/* <span className="tag">
                                                                        ₹699/mo
                                                                        onwards
                                                                    </span> */}
                                                                                <div className="mini-card-icon margin-b-m">
                                                                                    <img
                                                                                        src={
                                                                                            category.category_image_url
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <div className="mini-card-title">
                                                                                    <div className="label">
                                                                                        {
                                                                                            category.category_name
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-list">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </div>
            
        );
    }
}
export default Homepage;
