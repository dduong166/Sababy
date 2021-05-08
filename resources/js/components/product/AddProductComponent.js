import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Spin, Button, Modal, Form, Input, Cascader, InputNumber } from "antd";
import "./css/AddProductComponent.scss";
import { connect } from "react-redux";
import moment from "moment";

const { TextArea } = Input;

class AddProductComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            category_id: null,
            product_name: null,
            description: null,
            price: null,
            quantity: 1,
            outside_status: null,
            function_status: null,
            lat: null,
            lng: null,
            modal_step: 1
        };
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setConfirmLoading = this.setConfirmLoading.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeOutsideStatus = this.onChangeOutsideStatus.bind(this);
        this.onChangeFunctionStatus = this.onChangeFunctionStatus.bind(this);
        this.changeModalStep = this.changeModalStep.bind(this);
        this.initMap = this.initMap.bind(this);
    }

    onChangeCategory(value) {
        this.setState({ category_id: value[value.length - 1] });
    }
    onChangeProductName(e) {
        this.setState({ product_name: e.target.value });
    }
    onChangeDescription(e) {
        this.setState({ description: e.target.value });
    }
    onChangePrice(value) {
        this.setState({ price: value });
    }
    onChangeQuantity(value) {
        this.setState({ quantity: value });
    }
    onChangeOutsideStatus(e) {
        this.setState({ outside_status: e.target.value });
    }
    onChangeFunctionStatus(e) {
        this.setState({ function_status: e.target.value });
    }
    changeModalStep(step) {
        if (step === 2) {
            this.setState({ modal_step: step }, () => this.initMap());
        } else {
            this.setState({ modal_step: step });
        }
    }

    setModalVisible(status) {
        if (status === true) {
            if (!this.props.categories) {
                const uri = "http://localhost:8000/api/category";
                Http.get(uri).then(response => {
                    this.props.setCategories(response.data);
                });
            }
            this.setState({ visible: status });
        }
        if (status === false) {
            this.setState({ visible: status, modal_step: 1 });
        }
    }

    setConfirmLoading(status) {
        this.setState({ confirmLoading: status });
    }

    initMap() {
        //Mỗi lần modal step = 2, phải init lại 1 lần vì các thẻ html map đã bị reload lại chứ không tồn tại luôn luôn như bên sort
        console.log("init ne");
        if (this.state.visible) {
            let map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 21.0277644, lng: 105.8341598 },
                zoom: 10,
                gestureHandling: "greedy"
            });
            const card = document.getElementById("pac-card");
            const input = document.getElementById("pac-input");
            const options = {
                fields: ["formatted_address", "geometry", "name"],
                origin: map.getCenter(),
                strictBounds: false
            };
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);
            const autocomplete = new google.maps.places.Autocomplete(
                input,
                options
            );
            autocomplete.bindTo("bounds", map);
            const infowindow = new google.maps.InfoWindow();
            const infowindowContent = document.getElementById(
                "infowindow-content"
            );
            infowindow.setContent(infowindowContent);
            var marker = new google.maps.Marker({
                map
            });
            google.maps.event.addListener(map, "click", e => {
                var latLng = e.latLng;
                this.setState({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                map.panTo(marker.getPosition());
                input.value = "";
            });
            autocomplete.addListener("place_changed", () => {
                infowindow.close();
                const place = autocomplete.getPlace();
                console.log(place);

                if (!place.geometry || !place.geometry.location) {
                    // window.alert(
                    //     "Không tìm thấy vị trí " +
                    //         place.name +
                    //         " .Vui lòng chọn trên bản đồ."
                    // );
                    notification["error"]({
                        message:
                            "Không tìm thấy vị trí " +
                            place.name +
                            " .Vui lòng chọn trên bản đồ."
                    });
                    return;
                }
                this.setState({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map
                });
                map.panTo(marker.getPosition());
                map.setZoom(16);
                infowindowContent.children["place-name"].textContent =
                    place.name;
                infowindowContent.children["place-address"].textContent =
                    place.formatted_address;
                infowindow.open(map, marker);
            });
        }
    }

    handleOk() {
        this.setConfirmLoading(true);
        if (this.state.modal_step === 3) {
            console.log("Save to db");
            this.setModalVisible(false);
            this.setConfirmLoading(false);
        } else {
            this.changeModalStep(this.state.modal_step + 1);
        }
    }
    render() {
        console.log(this.state);
        let categories = this.props.categories;
        if (categories) {
            categories = categories.map((category, index) => ({
                value: category.id,
                label: category.category_name,
                children: category.sub_categories.map(
                    (sub_category, index) => ({
                        value: sub_category.id,
                        label: sub_category.category_name
                    })
                )
            }));
        }
        let modal;
        let footer;
        if (this.state.modal_step === 1) {
            modal = (
                <Form
                    labelCol={{
                        span: 6
                    }}
                    wrapperCol={{
                        span: 16
                    }}
                    layout="horizontal"
                    size="small"
                    initialValues={{
                        size: "small"
                    }}
                >
                    <Form.Item
                        label="Danh mục"
                        name="category"
                        rules={[
                            {
                                required: true,
                                message: "Hãy chọn danh mục sản phẩm"
                            }
                        ]}
                    >
                        <Cascader
                            placeholder="Lựa chọn danh mục sản phẩm"
                            options={categories}
                            onChange={this.onChangeCategory}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tên sản phẩm"
                        name="productName"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên sản phẩm"
                            }
                        ]}
                    >
                        <Input
                            onChange={this.onChangeProductName}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập mô tả sản phẩm"
                            }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            onChange={this.onChangeDescription}
                            placeholder="Thông tin của sản phẩm như kích cỡ, chất liệu, màu sắc, xuất xứ, thương hiệu,..."
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giá tiền (VND)"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập giá tiền"
                            }
                        ]}
                    >
                        <InputNumber
                            min={1}
                            step={50000}
                            onChange={this.onChangePrice}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập số lượng sản phẩm"
                            }
                        ]}
                    >
                        <InputNumber min={1} onChange={this.onChangeQuantity} />
                    </Form.Item>
                    <Form.Item
                        label="Tình trạng ngoại quan"
                        name="outsideStatus"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Hãy nhập tình trạng ngoại quan của sản phẩm"
                            }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết tình trạng bên ngoài của sản phẩm như xước nhẹ ở vị trí nào, bị ngả màu vàng ố hay không,..."
                            onChange={this.onChangeOutsideStatus}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tình trạng chức năng"
                        name="functionStatus"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Hãy nhập tình trạng về chức năng của sản phẩm"
                            }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết tình trạng về khả năng sử dụng sản phẩm như: sử dụng còn tốt, có tiếng kêu nhỏ khi di chuyển (xe đẩy),...."
                            onChange={this.onChangeFunctionStatus}
                        />
                    </Form.Item>
                </Form>
            );

            footer = [
                <Button
                    key="cancel"
                    onClick={() => this.setModalVisible(false)}
                >
                    Đóng
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => this.handleOk()}
                >
                    Tiếp theo
                </Button>
            ];
        } else if (this.state.modal_step === 2) {
            modal = (
                <div className="google-place-autocomplete">
                    <div className="pac-card" id="pac-card">
                        <div id="pac-container">
                            <input
                                id="pac-input"
                                type="text"
                                placeholder="Nhập vị trí của bạn hoặc vị trí nhận hàng"
                            />
                        </div>
                    </div>
                    <div id="map"></div>
                    <div id="infowindow-content">
                        <span id="place-name" className="title"></span>
                        <br />
                        <span id="place-address"></span>
                    </div>
                </div>
            );
            footer = [
                <Button key="back" onClick={() => this.changeModalStep(1)}>
                    Quay lại
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => this.handleOk()}
                >
                    Tiếp theo
                </Button>
            ];
        } else {
            modal = <p>ahihihi 3</p>;
            footer = [
                <Button key="back" onClick={() => this.changeModalStep(2)}>
                    Quay lại
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => this.handleOk()}
                >
                    Thêm sản phẩm
                </Button>
            ];
        }

        return (
            <div className="add-product-btn d-flex justify-content-end">
                <Button
                    type="primary"
                    onClick={() => this.setModalVisible(true)}
                >
                    Thêm sản phẩm mới
                </Button>
                <Modal
                    title="Thêm sản phẩm mới"
                    visible={this.state.visible}
                    onOk={() => this.handleOk()}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={() => this.setModalVisible(false)}
                    width={800}
                    footer={footer}
                >
                    {modal}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categoryDetail.categories,
        products: state.productDetail.products,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCategories: categories => {
            dispatch({
                type: "SET_CATEGORIES",
                payload: categories
            });
        },
        setProducts: products => {
            dispatch({
                type: "SET_PRODUCTS",
                payload: products
            });
        },
        setBookmark: (bookmark, index) => {
            dispatch({
                type: "SET_BOOKMARK",
                payload: bookmark,
                index: index
            });
        },
        setUnbookmark: index => {
            dispatch({
                type: "SET_UNBOOKMARK",
                index: index
            });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddProductComponent);
