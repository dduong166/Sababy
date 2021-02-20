import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductCard.scss";
import { connect } from "react-redux";

class ProductCard extends Component {
    render() {
        let product = this.props.product;
        return (
            <div className="product-card col-md-4">
                <Link
                    to={"/product/" + product.id}
                    key={product.id}
                >
                    <div className="product_card_content">
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

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    };
};

export default connect(mapStateToProps, null)(ProductCard);
