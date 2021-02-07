import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductCard.scss";

class ProductCard extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         categories: []
    //     };
    //     this.getCategories = this.getCategories.bind(this);
    // }

    // componentDidMount() {
    //     this.getCategories();
    // }

    // getCategories() {
    //     let uri = "api/category";
    //     Http.get(uri).then(response => {
    //         this.setState({
    //             categories: response.data
    //         });
    //         // console.log(this.state.categories);
    //     });
    // }

    render() {
        let product = this.props.product;
        return (
            <div className="product-card col-md-4">
                    <Link
                        to={"/product/" + product.product_id}
                        key={product.product_id}
                    >
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
                                        {product.product_name}
                                    </div>
                                </div>
                                <div className="product_address_and_rate d-flex flex-row justify-content-start">
                                    <div className="light_text">{product.location}</div>
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
                                    {
                                        product.discount ? (
                                            <div className="old_price">
                                                <strike>{product.price.toLocaleString()} đ</strike>
                                            </div>
                                        ) : ""
                                    }
                                    <div className="new_price">
                                        {(product.price*(100-product.discount)/100).toLocaleString()} đ 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
            </div>
        );
    }
}
export default ProductCard;
