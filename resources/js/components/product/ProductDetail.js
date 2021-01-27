import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
// import "./css/.css";


class ProductDetail extends Component {
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
        let parent_categories = this.state.categories.filter((category) =>{
            return category.parent_category_id === null
        })
        return (
            <div className="product-detail">
              
            </div>
            );
    }
}
export default ProductDetail;
