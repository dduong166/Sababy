import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductCard.scss";

class ProductCard extends Component {
    // constructor(props){
    //     this.showBookmark = this.showBookmark.bind(this);
    // }

    // componentDidMount(){
    //     this.showBookmark();
    // }

    // showBookmark(){

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
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="far"
                                    data-icon="heart"
                                    class="svg-inline--fa fa-heart fa-w-16"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"
                                    ></path>
                                </svg>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
                            </span>
                        </div>
                        <div className="product_image">
                            {product.product_medias[0] ? (
                                <img
                                    src={product.product_medias[0].media_url}
                                    alt=""
                                />
                            ) : (
                                <img
                                    src="https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/reference_guide/is_your_baby_teething_ref_guide/1800x1200_is_your_baby_teething_ref_guide.jpg?resize=750px:*"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="product_preview_content">
                            <div className="product_name_line d-flex flex-row justify-content-start">
                                <div className="product_name">
                                    {product.product_name}
                                </div>
                            </div>
                            <div className="product_address_and_rate d-flex flex-row justify-content-start">
                                <div className="light_text">
                                    {product.location}
                                </div>
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
                                {product.discount ? (
                                    <div className="old_price">
                                        <strike>
                                            {product.price.toLocaleString()} đ
                                        </strike>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="new_price">
                                    {(
                                        (product.price *
                                            (100 - product.discount)) /
                                        100
                                    ).toLocaleString()}{" "}
                                    đ
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
