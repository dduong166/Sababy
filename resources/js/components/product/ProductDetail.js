import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductDetail.scss";
import SlideShow from "react-image-show";
import { connect } from "react-redux";

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            quantity: 1
        };
        this.getProductDetail = this.getProductDetail.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    componentDidMount() {
        this.getProductDetail();
    }

    getProductDetail() {
        let uri =
            "http://localhost:8000/api/product/" +
            this.props.match.params.product_id;
        Http.get(uri)
            .then(response => {
                this.props.setProductDetail(response.data);
                this.setState({ loading: false });
            })
            .catch(error => console.log(error));
    }

    onChangeQuantity(e) {
        this.setState({ quantity: e.target.value });
    }

    render() {
        var detail = this.props.detail;
        if (detail) {
            var images = detail.product_medias.map((media, index, medias) => {
                return media.media_url;
            });
            console.log(images);
        }
        return (
            <div className="product-detail">
                {!this.state.loading && detail ? (
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Trang chủ</Link>
                                </li>
                                {detail.parent_category[0].category_name ? (
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={
                                                "/category/" +
                                                detail.parent_category[0]
                                                    .category_id
                                            }
                                        >
                                            {
                                                detail.parent_category[0]
                                                    .category_name
                                            }
                                        </Link>
                                    </li>
                                ) : (
                                    ""
                                )}
                                <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                >
                                    {detail.category.category_name}
                                </li>
                            </ol>
                        </nav>
                        <div className="main-section row">
                            <div className="product-image col-lg-6">
                                <SlideShow
                                    images={images}
                                    width="540px"
                                    imagesWidth="470px"
                                    imagesHeight="450px"
                                    thumbnailsWidth="540px"
                                    thumbnailsHeight="12vw"
                                    infinite
                                    indicators
                                    thumbnails
                                    fixedImagesHeight
                                />
                            </div>
                            <div className="product-short-info col-lg-6">
                                <div className="product-name">
                                    {detail.product_name}
                                </div>
                                {/* <div className="product-location">
                                    Gửi từ {detail.location}
                                </div> */}
                                <div className="product-short-description">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>
                                                    TÌNH TRẠNG NGOẠI QUAN
                                                </th>
                                                <td>
                                                    {detail.outside_status}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    TÌNH TRẠNG SỬ DỤNG
                                                </th>
                                                <td>
                                                    {detail.function_status}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    GỬI TỪ
                                                </th>
                                                <td>
                                                {detail.location}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <hr/>
                                <div className="product-quantity form-group d-flex flex-row justify-content-start align-items-center">
                                    <div className="quantity-title">
                                        Số lượng:
                                    </div>
                                    <input
                                        className="form-control quantity-number-input"
                                        type="number"
                                        min="1"
                                        value={this.state.quantity}
                                        onChange={this.onChangeQuantity}
                                    />
                                </div>
                                <div className="price d-flex flex-row justify-content-start align-items-center">
                                    {detail.discount ? (
                                        <div className="old_price">
                                            <strike>
                                                {detail.price.toLocaleString()}{" "}
                                                đ
                                            </strike>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="new_price">
                                        {(
                                            (detail.price *
                                                (100 - detail.discount)) /
                                            100
                                        ).toLocaleString()}{" "}
                                        đ
                                    </div>
                                </div>
                                <div className="add-to-cart-and-buy-button d-flex flex-row justify-content-start align-items-center">
                                    <button className="add-to-cart-button">THÊM VÀO GIỎ HÀNG</button>
                                    <button className="buy-button">MUA NGAY</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    "Loading..."
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        detail: state.productDetail.detail
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProductDetail: detail => {
            dispatch({
                type: "SET_PRODUCT_DETAIL",
                payload: detail
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
