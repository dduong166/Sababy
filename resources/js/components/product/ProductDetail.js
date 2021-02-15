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
            loading: true
        };
        this.getProductDetail = this.getProductDetail.bind(this);
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
                                {detail.product_name}
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
