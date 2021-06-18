import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import "./css/ProductDetail.scss";
import { Spin } from "antd";
import SlideShow from "react-image-show";
import { connect } from "react-redux";
import QuestionComponent from "./QuestionComponent";
import moment from "moment";

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            quantity: 1,
            question: "",
            answer: ""
        };
        this.getProductDetail = this.getProductDetail.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    componentDidMount() {
        this.getProductDetail();
    }

    getProductDetail() {
        let uri =
            process.env.MIX_API_URL + "api/product/" +
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
            var images = detail.product_medias.map((media, index) => {
                return media.media_url;
            });
        }
        var created_at = moment(detail.created_at).format("DD/MM/YYYY");

        return (
            <div className="product-detail fullscreen-min-height">
                {!this.state.loading && detail ? (
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Trang chủ</Link>
                                </li>
                                {detail.parent_category ? (
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={
                                                "/category/" +
                                                detail.parent_category[0].id
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
                                    <Link
                                        to={"/category/" + detail.category.id}
                                    >
                                        {detail.category.category_name}
                                    </Link>
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
                                />
                            </div>
                            <div className="product-short-info col-lg-6">
                                <div className="product-name">
                                    {detail.product_name}
                                </div>
                                <div className="product-short-description">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>NGƯỜI BÁN</th>
                                                <td>{detail.owner ? detail.owner.name : <del>Tài khoản đã bị xóa</del>}</td>
                                            </tr>
                                            <tr>
                                                <th>SỐ ĐIỆN THOẠI</th>
                                                <td>
                                                    {detail.owner ? detail.owner.phonenumber : <del>Tài khoản đã bị xóa</del>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>SỐ LƯỢNG</th>
                                                <td>{detail.quantity}</td>
                                            </tr>
                                            <tr>
                                                <th>GỬI TỪ</th>
                                                <td>{detail.city}</td>
                                            </tr>
                                            <tr>
                                                <th>TÌNH TRẠNG BÊN NGOÀI</th>
                                                <td>{detail.outside_status}</td>
                                            </tr>
                                            <tr>
                                                <th>TÌNH TRẠNG SỬ DỤNG</th>
                                                <td>
                                                    {detail.function_status}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>NGÀY ĐĂNG BÁN</th>
                                                <td>
                                                    {created_at}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>GIÁ SẢN PHẨM</th>
                                                <td>
                                                    <div className="price d-flex flex-row justify-content-start align-items-center">
                                                        <div className="new_price">
                                                            {detail.price.toLocaleString()}{" "}
                                                            đ
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="product-detail-info row">
                            <div className="col-lg-12">
                                <nav>
                                    <div
                                        className="nav nav-tabs nav-fill"
                                        id="nav-tab"
                                        role="tablist"
                                    >
                                        <a
                                            className="nav-item nav-link active"
                                            id="nav-home-tab"
                                            data-toggle="tab"
                                            href="#nav-home"
                                            role="tab"
                                            aria-controls="nav-home"
                                            aria-selected="true"
                                        >
                                            MÔ TẢ CHI TIẾT
                                        </a>
                                        <a
                                            className="nav-item nav-link"
                                            id="nav-profile-tab"
                                            data-toggle="tab"
                                            href="#nav-profile"
                                            role="tab"
                                            aria-controls="nav-profile"
                                            aria-selected="false"
                                        >
                                            CÂU HỎI
                                        </a>
                                    </div>
                                </nav>
                                <div
                                    className="tab-content"
                                    id="nav-tabContent"
                                >
                                    <div
                                        className="tab-pane fade show active"
                                        id="nav-home"
                                        role="tabpanel"
                                        aria-labelledby="nav-home-tab"
                                    >
                                        {detail.description}
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="nav-profile"
                                        role="tabpanel"
                                        aria-labelledby="nav-profile-tab"
                                    >
                                        <QuestionComponent />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="loading d-flex justify-content-center align-items-center">
                        <Spin />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        detail: state.productDetail.detail,
        auth: state.auth
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
