import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductCard.scss";

class ProductCard extends Component {
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
            <div className="product-card">
                <a>
                    <div className="morphing-wrapper d-flex justify-content-center">
                        <div className="morphing-container d-flex justify-content-center">
                            <div className="tile d-flex flex-column">
                                <div className="tile-header">
                                    <div className="image-container ">
                                        <img
                                            src="./Rent Beds &amp; Bedroom Furniture in Mumbai _ Furlenco_files/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg"
                                            alt=""
                                            data-srcset="https://assets.furlenco.com/image/upload/c_fit,dpr_1.0,f_auto,q_auto,w_360/v1/furlenco-images/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg 1x, https://assets.furlenco.com/image/upload/c_fit,dpr_2.0,f_auto,q_auto,w_360/v1/furlenco-images/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg 2x, https://assets.furlenco.com/image/upload/c_fit,dpr_3.0,f_auto,q_auto,w_360/v1/furlenco-images/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg 3x"
                                            sizes=""
                                            className="lazy loaded"
                                            srcSet="https://assets.furlenco.com/image/upload/c_fit,dpr_1.0,f_auto,q_auto,w_360/v1/furlenco-images/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg 1x, https://assets.furlenco.com/image/upload/c_fit,dpr_2.0,f_auto,q_auto,w_360/v1/furlenco-images/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg 2x, https://assets.furlenco.com/image/upload/c_fit,dpr_3.0,f_auto,q_auto,w_360/v1/furlenco-images/ewbof20R_mobile_Bordo-Queen-Delphie-Basic-Mobile.jpg 3x"
                                        />
                                    </div>
                                    <button className="wishlist">
                                        <span className="action-label padding-l-m padding-r-s">
                                            BOOKMARK
                                        </span>
                                        <svg width="28" height="28">
                                            <path
                                                fill="none"
                                                stroke="rgb(255, 0, 0)"
                                                d="M14.182 7.072A5.737 5.737 0 0118.16 5.5c3.143 0 5.706 2.482 5.706 5.542 0 2.642-1.712 5.292-4.559 7.86a30.493 30.493 0 01-3.15 2.47c-.68.467-1.24.817-1.605 1.03a.736.736 0 01-.72.008 23.688 23.688 0 01-1.61-.983 28.113 28.113 0 01-3.157-2.405c-2.85-2.525-4.564-5.209-4.564-7.98 0-3.06 2.563-5.542 5.706-5.542 1.505 0 2.915.563 3.976 1.572z"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="tile-content flex-fill padding-rl-l">
                                    <div className="tile-main">
                                        <h3 className="tile-main-heading padding-tb-m">
                                            Bordo Queen Bedroom - Damask with
                                            Premium 6" Mattress
                                        </h3>
                                    </div>
                                    <div className="tile-collapsed-info padding-b-l">
                                        <div className="d-flex">
                                            <div className="tags d-flex align-items-center">
                                                <svg width="22" height="17">
                                                    <g
                                                        fill="none"
                                                        fillRule="evenodd"
                                                        stroke="#444"
                                                        transform="matrix(-1 0 0 1 21 3)"
                                                    >
                                                        <path
                                                            fill="#FFF"
                                                            d="M11.895 3.5V.205h3.622c.224 0 .433.113.557.3l3.063 4.635c.073.11.111.238.111.369v3.912a.668.668 0 01-.668.668H3.081V3.5h8.814z"
                                                        ></path>
                                                        <circle
                                                            cx="8"
                                                            cy="10"
                                                            r="2"
                                                            fill="#FFF"
                                                            fillRule="nonzero"
                                                        ></circle>
                                                        <circle
                                                            cx="15"
                                                            cy="10"
                                                            r="2"
                                                            fill="#FFF"
                                                            fillRule="nonzero"
                                                        ></circle>
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M4.5 5.5h-4m4 2h-2"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                <span className="padding-l-s font-color-333">
                                                    Hanoi
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="tile-package-variants">
                                        <div className="btn-group d-flex margin-b-m">
                                            <button className="active">
                                                basic
                                            </button>
                                            <button className="">value</button>
                                            <button className="">prime</button>
                                        </div>
                                        <div className="tile-items d-flex flex-column">
                                            <div className="tile-items-heading">
                                                2 ITEMS
                                            </div>
                                            <div className="d-flex">
                                                <div className="tile-item d-flex flex-column justify-content-center align-items-center margin-r-s">
                                                    <div className="item-oval d-flex justify-content-center align-items-center">
                                                        <img
                                                            src="./Rent Beds &amp; Bedroom Furniture in Mumbai _ Furlenco_files/WjOuJ5tb___FUR3827_2.jpg"
                                                            itemProp="image"
                                                            width="100%"
                                                        />
                                                    </div>
                                                    <div className="item-oval-unit d-flex justify-content-center align-items-center">
                                                        <span>1 unit</span>
                                                    </div>
                                                </div>
                                                <div className="tile-item d-flex flex-column justify-content-center align-items-center margin-r-s">
                                                    <div className="item-oval d-flex justify-content-center align-items-center">
                                                        <img
                                                            src="./Rent Beds &amp; Bedroom Furniture in Mumbai _ Furlenco_files/GZhYxKBc___FUR4320_2 (1).jpg"
                                                            itemProp="image"
                                                            width="100%"
                                                        />
                                                    </div>
                                                    <div className="item-oval-unit d-flex justify-content-center align-items-center">
                                                        <span>1 unit</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="tile-footer d-flex">
                                    <div className="bottom-bar d-flex margin-rl-l flex-row-reverse align-items-center">
                                        <button className="btn btn-sm inverse tile-button">
                                            <span
                                                className="rental font-size-16"
                                                itemProp="priceCurrency"
                                            >
                                                ₹ 1049
                                            </span>
                                            <span
                                                className="rental"
                                                itemProp="lowPrice"
                                            >
                                                &nbsp;/mo
                                            </span>
                                        </button>
                                        <span class="benefits mat-caption d-flex">
                                            <span
                                                itemprop="highPrice"
                                                class="benefit-amount font-color-444 margin-r-m"
                                            >
                                                ₹ 949/mo
                                            </span>
                                            <span class="benefit-percentage margin-r-m">
                                                -26%
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className=" tag-container font-size-12 font-color-snow">
                                    <div className="tag-ribbon h-100">
                                        <div className="tag-ribbon-curl"></div>
                                        <div className="padding-rl-m padding-tb-s align-items-center d-flex h-100 justify-content-center tag-text">
                                            Sản phẩm mới
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}
export default ProductCard;
