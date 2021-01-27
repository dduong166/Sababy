import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductCardRefactor.scss";

class ProductCardRefactor extends Component {
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
            <div className="product-card col-md-4">
                <div className="product_card_content">
                    <div className="bookmark d-flex flex-row justify-content-end ">
                        <span>
                            <img src="https://cdn0.iconfinder.com/data/icons/ui-standard-vol-2/96/Heart-512.png" />
                        </span>
                    </div>
                    <div className="product_image">
                        <img
                            src="https://assets.furlenco.com/image/upload/c_fit,dpr_1.0,f_auto,q_auto,w_360/v1/furlenco-images/MltlkcLM_mobile_Allen-Queen-Bed-value-Mobile.jpg"
                            alt=""
                        />
                    </div>
                    <div className="product_preview_content">
                        <div className="product_name_line d-flex flex-row justify-content-start">
                            <div className="product_name">
                                Bordo Queen Bedroom - Damask with Premium 6"
                                Mattress
                            </div>
                        </div>
                        <div className="product_address_and_rate d-flex flex-row justify-content-start">
                            <div className="light_text">Hà Nội</div>
                            <div className="sold_stars ml-auto">
                                {" "}
                                <i className="fa fa-star"></i>{" "}
                                <i className="fa fa-star"></i>{" "}
                                <i className="fa fa-star"></i>{" "}
                                <i className="fa fa-star"></i>{" "}
                                <i className="fa fa-star"></i>
                                <span className="light_text rate_number">
                                    (100)
                                </span>
                            </div>
                        </div>
                        <div className="price top-border d-flex flex-row justify-content-end align-items-center">
                            <div className="old_price">
                                <strike>7.000.000đ/năm</strike>
                            </div>
                            <div className="new_price">6.000.000đ/năm</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProductCardRefactor;
