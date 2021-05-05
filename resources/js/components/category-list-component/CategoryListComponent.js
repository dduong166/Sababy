import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/CategoryListComponent.scss";

class CategoryList extends Component {
    render() {
        let categories = this.props.categories;
        return (
            <div className="category-list">
                {categories.map((category, index) => (
                    <Link
                        to={"/category/" + category.id}
                        key={category.id}
                    >
                        <div className="category-card">
                            <img src={category.category_image_url} />
                            <div className="category-card-title">
                                {category.category_name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }
}
export default CategoryList;
