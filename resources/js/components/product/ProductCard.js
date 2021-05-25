import React, { Component } from "react";
import Http from "../../Http";
import { withRouter, Link } from "react-router-dom";
import { Button, Popconfirm, Spin, notification } from "antd";
import {
    DeleteOutlined,
    CheckCircleOutlined,
    DollarCircleOutlined
} from "@ant-design/icons";
import "./css/ProductCard.scss";
import AddProductComponent from "./AddProductComponent";
import { connect } from "react-redux";

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarkEvent: false,
            unBookmarkEvent: false,
            isLoading: false
        };
        this.BookmarkClick = this.BookmarkClick.bind(this);
        this.unBookmarkClick = this.unBookmarkClick.bind(this);
        this.handleShowDetail = this.handleShowDetail.bind(this);
        this.changeSoldStatus = this.changeSoldStatus.bind(this);
        this.changeBookmarkEvent = this.changeBookmarkEvent.bind(this);
        this.changeUnBookmarkEvent = this.changeUnBookmarkEvent.bind(this);
        this.onDeleteProduct = this.onDeleteProduct.bind(this);
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        // return null when escapse component, it will no longer hold any data in memory
        this.setState = (state,callback)=>{
            return;
        };
    }
    
    changeBookmarkEvent(value) {
        this.setState({
            bookmarkEvent: value
        });
    }
    changeUnBookmarkEvent(value) {
        this.setState({
            unBookmarkEvent: value
        });
    }
    BookmarkClick(e) {
        e.stopPropagation();
        console.log(1, e.target.dataset.productid);
        if (this.state.bookmarkEvent) {
            console.log("click bookmark it thoi!!");
            return;
        } else {
            this.changeBookmarkEvent(true);
            var productId = e.target.dataset.productid;
            console.log(productId);
            let uri = "http://localhost:8000/api/bookmark";
            const newBookmark = {
                product_id: productId
            };
            Http.post(uri, newBookmark).then(response => {
                if (response.data) {
                    this.props.setBookmark(response.data, this.props.index);
                }
                this.changeBookmarkEvent(false);
            });
        }
    }
    unBookmarkClick(e) {
        e.stopPropagation();
        if (this.state.unBookmarkEvent) {
            console.log("click unbookmark it thoi!!");
            return;
        } else {
            this.changeUnBookmarkEvent(true);
            var productId = e.target.dataset.productid;
            let uri = `http://localhost:8000/api/bookmark/${productId}`;
            Http.delete(uri)
                .then(response => {
                    if (response.data) {
                        console.log(1, response.data);
                        this.props.setUnbookmark(this.props.index);
                    }
                    this.changeUnBookmarkEvent(false);
                })
                .catch(error => console.log(error));
        }
    }

    handleShowDetail() {
        const product = this.props.product;
        this.props.history.push(`/product/${product.id}`);
    }

    changeSoldStatus(e) {
        e.stopPropagation();
        this.setState({ isLoading: true });
        const id = e.currentTarget.dataset.id;
        const sold_status = Number(e.currentTarget.dataset.value);
        let changeProduct = { sold: sold_status };
        const uri = `http://localhost:8000/api/product/${id}`;
        Http.put(uri, changeProduct).then(response => {
            if (response) {
                if (sold_status) {
                    //if sold_status === 1 -> from selling to sold
                    this.props.changeToSold(id);
                } else {
                    this.props.changeToSelling(id);
                }
            }
            notification["success"]({
                message: "Chuyển trạng thái thành công.",
            });
            this.setState({ isLoading: false });
        });
    }

    onDeleteProduct() {
        this.setState({ isLoading: true });
        const uri = `http://localhost:8000/api/product/${this.props.product.id}`;
        Http.delete(uri).then(response => {
            if (response.data) {
                this.props.deleteProduct(this.props.product);
            }
            notification["success"]({
                message: "Xóa sản phẩm thành công.",
            });
            this.setState({ isLoading: false });
        });
    }

    render() {
        let product = this.props.product;
        const card_footer = (
            <div className="product-footer d-flex justify-content-center">
                {this.props.soldProduct ? (
                    <Button
                        icon={<DollarCircleOutlined />}
                        onClick={e => this.changeSoldStatus(e)}
                        data-id={product.id}
                        data-value={0}
                    >
                        Mở bán
                    </Button>
                ) : (
                    <Button
                        icon={<CheckCircleOutlined />}
                        onClick={e => this.changeSoldStatus(e)}
                        data-id={product.id}
                        data-value={1}
                    >
                        Đã bán
                    </Button>
                )}

                <AddProductComponent edit_product={product} />
                <div onClick={e => e.stopPropagation()}>
                    <Popconfirm
                        placement="top"
                        title="Bạn muốn xóa sản phẩm này?"
                        onConfirm={() => this.onDeleteProduct()}
                        okText="Xóa"
                        cancelText="Quay lại"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        );
        return (
            <div className="product-card col-md-4">
                {/* <Link to={"/product/" + product.id} key={product.id}> */}
                <div
                    className="product_card_content"
                    onClick={this.handleShowDetail}
                >
                    {/* {this.props.currentUser ? (
                    <div className="bookmark">
                        {product.bookmarks && product.bookmarks.length ? (
                            <i
                                className="fa fa-heart"
                                data-productid={product.id}
                                onClick={e => this.unBookmarkClick(e)}
                            ></i>
                        ) : (
                            <i
                                className="fa fa-heart-o"
                                data-productid={product.id}
                                onClick={e => this.BookmarkClick(e)}
                            ></i>
                        )}
                    </div>
                ) : null} */}
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
                        <div className="product_address_and_price d-flex flex-row justify-content-between">
                            <div className="light_text d-flex align-items-center">
                                {product.city}{" "}
                                {product.distance ? (
                                    <span>
                                        (cách{" "}
                                        {(
                                            Math.round(product.distance / 100) /
                                            10
                                        ).toLocaleString()}
                                        km)
                                    </span>
                                ) : null}
                            </div>
                            <div className="price top-border d-flex flex-row align-items-center">
                                <div className="new_price">
                                    {product.price.toLocaleString()} đ
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.props.myProduct ? (
                        <React.Fragment>
                            {this.state.isLoading ? (
                                <Spin tip="Đang xử lý...">{card_footer}</Spin>
                            ) : (
                                <React.Fragment>{card_footer}</React.Fragment>
                            )}
                        </React.Fragment>
                    ) : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeToSold: product_id => {
            dispatch({
                type: "CHANGE_TO_SOLD_STATUS",
                payload: product_id
            });
        },
        changeToSelling: product_id => {
            dispatch({
                type: "CHANGE_TO_SELLING_STATUS",
                payload: product_id
            });
        },
        deleteProduct: product => {
            dispatch({
                type: "DELETE_PRODUCT",
                payload: product
            });
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProductCard)
);
