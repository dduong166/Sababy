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
                <div className="bookmark d-flex flex-row justify-content-end ">
                    <span>
                        <img src="https://cdn0.iconfinder.com/data/icons/ui-standard-vol-2/96/Heart-512.png" />
                    </span>
                </div>
                <div className="bbb_deals">
                    {/* <div className="ribbon ribbon-top-right ">
                        <span><img src="https://cdn0.iconfinder.com/data/icons/ui-standard-vol-2/96/Heart-512.png"/></span>
                    </div> */}

                    <div className="bbb_deals_slider_container">
                        <div className=" bbb_deals_item">
                            <div className="bbb_deals_image">
                                <img
                                    src="https://res.cloudinary.com/dxfq3iotg/image/upload/v1562074043/234.png"
                                    alt=""
                                />
                            </div>
                            <div className="bbb_deals_content">
                                <div className="bbb_deals_info_line d-flex flex-row justify-content-start">
                                    <div className="bbb_deals_item_name">
                                    Bordo Queen Bedroom - Damask with Premium 6" Mattress
                                    </div>
                                </div>
                                <div className="available">
                                    <div className="available_line d-flex flex-row justify-content-start">
                                        <div className="available_title">
                                            From Hanoi
                                        </div>
                                        <div className="sold_stars ml-auto">
                                            {" "}
                                            <i className="fa fa-star"></i>{" "}
                                            <i className="fa fa-star"></i>{" "}
                                            <i className="fa fa-star"></i>{" "}
                                            <i className="fa fa-star"></i>{" "}
                                            <i className="fa fa-star"></i> (100)
                                        </div>
                                    </div>
                                </div>
                                <div className="price d-flex flex-row justify-content-start">
                                    <div className="old_price">
                                        <strike>7.000.000đ/năm</strike>
                                    </div>
                                    <div className="new_price">
                                        6.000.000đ/năm
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProductCardRefactor;
