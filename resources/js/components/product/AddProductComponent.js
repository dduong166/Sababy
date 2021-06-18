import React, { Component } from "react";
import Http from "../../Http";
import { Link, withRouter } from "react-router-dom";
import {
    Spin,
    Button,
    Modal,
    Form,
    Input,
    Cascader,
    InputNumber,
    notification,
    Image
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Widget, WidgetLoader } from "react-cloudinary-upload-widget";
import "./css/AddProductComponent.scss";
import { connect } from "react-redux";
import { times } from "lodash";

const { TextArea } = Input;
var map_id;
var product_medias_edit;

class AddProductComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            category_id: null,
            category_cascader: [],
            product_name: null,
            description: null,
            price: null,
            quantity: 1,
            outside_status: null,
            function_status: null,
            lat: null,
            lng: null,
            city: null,
            images: [],
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
        this.onAddImage = this.onAddImage.bind(this);
        this.onDeleteImage = this.onDeleteImage.bind(this);
        this.changeModalStep = this.changeModalStep.bind(this);
        this.initMap = this.initMap.bind(this);
        this.onEditProduct = this.onEditProduct.bind(this);
    }

    componentDidMount() {
        if (!this.props.categories) {
            //Nếu category list đã được lấy ra vào lưu vào redux
            const uri = process.env.MIX_API_URL + "api/category";
            Http.get(uri).then(response => {
                this.props.setCategories(response.data);
            });
        }
    }

    onEditProduct(e) {
        e.stopPropagation();
        this.setModalVisible(true);
    }

    onChangeCategory(value) {
        this.setState({
            category_id: value[value.length - 1],
            category_cascader: value
        });
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
    onAddImage(value) {
        var joined = this.state.images.concat(value.info.secure_url);
        this.setState({ images: joined });
    }
    onDeleteImage() {
        this.setState({ images: [] });
    }

    setModalVisible(status) {
        if (status === true) {
            if (this.props.edit_product) {
                let edit_product = this.props.edit_product;
                let category_cascader = [edit_product.category_id];
                this.map_id = `map${edit_product.id}`;
                product_medias_edit = edit_product.product_medias.map(
                    media => media.media_url
                );
                this.props.categories.map(category => {
                    category.sub_categories.map(sub_category => {
                        if (sub_category.id === edit_product.category_id) {
                            category_cascader.unshift(category.id);
                        }
                    });
                });
                const location = edit_product.location.split(",");
                this.setState({
                    category_id: edit_product.category_id,
                    category_cascader: category_cascader,
                    product_name: edit_product.product_name,
                    description: edit_product.description,
                    price: edit_product.price,
                    quantity: edit_product.quantity,
                    outside_status: edit_product.outside_status,
                    function_status: edit_product.function_status,
                    lat: parseFloat(location[0]),
                    lng: parseFloat(location[1]),
                    city: edit_product.city,
                    images: product_medias_edit
                });
            } else if (
                this.props.currentUser &&
                this.props.currentUser.address
            ) {
                const location = this.props.currentUser.address.split(",");
                this.setState({
                    lat: parseFloat(location[0]),
                    lng: parseFloat(location[1])
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
        console.log("init ne");
        //Mỗi lần modal step = 2, phải init lại 1 lần vì các thẻ html map đã bị reload lại chứ không tồn tại luôn luôn như bên sort
        if (this.state.visible) {
            let map;
            if (this.props.edit_product) {
                map = new google.maps.Map(
                    document.getElementById(this.map_id),
                    {
                        center: { lat: 21.0277644, lng: 105.8341598 },
                        zoom: 10,
                        gestureHandling: "greedy"
                    }
                );
            } else {
                map = new google.maps.Map(
                    document.getElementById("map_add_product"),
                    {
                        center: { lat: 21.0277644, lng: 105.8341598 },
                        zoom: 10,
                        gestureHandling: "greedy"
                    }
                );
            }

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
            if (this.state.lat && this.state.lng) {
                //Nếu như trước đó đã được chọn vị trí -> hiện marker
                let latLng = { lat: this.state.lat, lng: this.state.lng };
                console.log(latLng);
                infowindow.close();
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                map.setZoom(16);
                infowindowContent.children[
                    "place-name"
                ].textContent = `(${this.state.lat},${this.state.lng})`;
                infowindowContent.children["place-address"].textContent = "";
                infowindow.open(map, marker);
            }
            google.maps.event.addListener(map, "click", e => {
                //Trường hợp chọn vị trí bằng click
                infowindow.close();
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
                // map.panTo(marker.getPosition());
                input.value = "";
                map.setZoom(16);
                infowindowContent.children["place-name"].textContent = latLng;
                infowindowContent.children["place-address"].textContent = "";
                infowindow.open(map, marker);
            });
            autocomplete.addListener("place_changed", () => {
                //Trường hợp dùng autocomplete
                infowindow.close();
                const place = autocomplete.getPlace();
                console.log(place);

                if (!place.geometry || !place.geometry.location) {
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
            if (this.state.images.length) {
                const newProduct = {
                    category_id: this.state.category_id,
                    product_name: this.state.product_name,
                    description: this.state.description,
                    price: this.state.price,
                    quantity: this.state.quantity,
                    outside_status: this.state.outside_status,
                    function_status: this.state.function_status,
                    location: `${this.state.lat},${this.state.lng}`,
                    city: this.state.city,
                    images: this.state.images
                };
                if (this.props.edit_product) {
                    if (
                        JSON.stringify(this.state.images) ==
                        JSON.stringify(product_medias_edit)
                    ) {
                        delete newProduct.images;
                    }
                    const uri =
                        process.env.MIX_API_URL +
                        `api/product/${this.props.edit_product.id}`;
                    Http.put(uri, newProduct).then(response => {
                        if (response) {
                            console.log(response);
                            this.props.updateProducts(response.data);
                            notification["success"]({
                                message: "Sửa thông tin sản phẩm thành công.",
                                description:
                                    "Nhấn vào đây để chuyển sang màn xem chi tiết sản phẩm.",
                                onClick: () => {
                                    this.props.history.push(
                                        `/product/${response.data.id}`
                                    );
                                }
                            });
                        }
                    });
                } else {
                    let uri = process.env.MIX_API_URL + "api/product"; //them vao redux
                    Http.post(uri, newProduct).then(response => {
                        if (response) {
                            this.props.updateProductList();
                            this.setState({
                                category_id: null,
                                category_cascader: [],
                                product_name: null,
                                description: null,
                                price: null,
                                quantity: 1,
                                outside_status: null,
                                function_status: null,
                                images: []
                            });
                            notification["success"]({
                                message: "Thêm sản phẩm thành công.",
                                description:
                                    "Sản phẩm đã được thêm vào danh sách sản phẩm đang bán trong [Sản phẩm của tôi]. Nhấn vào đây để chuyển sang màn xem chi tiết sản phẩm.",
                                onClick: () => {
                                    this.props.history.push(
                                        `/product/${response.data.id}`
                                    );
                                }
                            });
                        }
                    });
                }

                this.setModalVisible(false);
                this.setConfirmLoading(false);
            } else {
                notification["error"]({
                    message: "Hãy tải lên ảnh sản phẩm."
                });
            }
        } else if (this.state.modal_step === 2) {
            if (!this.state.lat || !this.state.lng) {
                notification["error"]({
                    message: "Hãy chọn vị trí sản phẩm"
                });
            } else {
                const latLng = { lat: this.state.lat, lng: this.state.lng };
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: latLng }, (results, status) => {
                    if (status === "OK") {
                        console.log(results);
                        if (results[0]) {
                            const city = results[0].address_components.filter(
                                addr =>
                                    addr.types[0] ==
                                    "administrative_area_level_1"
                            );
                            if (city[0]) {
                                this.setState({ city: city[0].long_name });
                                this.changeModalStep(this.state.modal_step + 1);
                            } else {
                                notification["error"]({
                                    message:
                                        "Lấy thông tin thành phố thất bại. Hãy chọn lại vị trí"
                                });
                            }
                        }
                    }
                });
            }
        } else {
            if (
                !(
                    this.state.category_id &&
                    this.state.product_name &&
                    this.state.description &&
                    this.state.price &&
                    this.state.quantity &&
                    this.state.outside_status &&
                    this.state.function_status
                )
            ) {
                notification["error"]({
                    message: "Vui lòng nhập đầy đủ thông tin sản phẩm."
                });
            } else {
                this.changeModalStep(this.state.modal_step + 1);
            }
        }
    }
    render() {
        if (this.state.visible && !this.props.currentUser) {
            this.props.history.push("/login");
        }
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
        let title;
        if (this.state.modal_step === 1) {
            title = "Nhập thông tin cơ bản của sản phẩm";
            modal = (
                <Form
                    id="product-basic-info"
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
                    // onFinish={this.handleOk}
                    fields={[
                        {
                            name: ["category"],
                            value: this.state.category_cascader
                        },
                        {
                            name: ["productName"],
                            value: this.state.product_name
                        },
                        {
                            name: ["description"],
                            value: this.state.description
                        },
                        {
                            name: ["price"],
                            value: this.state.price
                        },
                        {
                            name: ["quantity"],
                            value: this.state.quantity
                        },
                        {
                            name: ["outsideStatus"],
                            value: this.state.outside_status
                        },
                        {
                            name: ["functionStatus"],
                            value: this.state.function_status
                        }
                    ]}
                >
                    <Form.Item label="Danh mục" name="category">
                        <Cascader
                            placeholder="Lựa chọn danh mục sản phẩm"
                            options={categories}
                            onChange={this.onChangeCategory}
                        />
                    </Form.Item>
                    <Form.Item label="Tên sản phẩm" name="productName">
                        <Input
                            onChange={this.onChangeProductName}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <TextArea
                            rows={4}
                            onChange={this.onChangeDescription}
                            placeholder="Thông tin của sản phẩm như kích cỡ, chất liệu, màu sắc, xuất xứ, thương hiệu,..."
                        />
                    </Form.Item>
                    <Form.Item label="Giá tiền (VND)" name="price">
                        <InputNumber
                            min={1}
                            step={50000}
                            onChange={this.onChangePrice}
                        />
                    </Form.Item>
                    <Form.Item label="Số lượng" name="quantity">
                        <InputNumber min={1} onChange={this.onChangeQuantity} />
                    </Form.Item>
                    <Form.Item
                        label="Tình trạng bên ngoài"
                        name="outsideStatus"
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
                    form="product-basic-info"
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.handleOk()}
                >
                    Tiếp theo
                </Button>
            ];
        } else if (this.state.modal_step === 2) {
            if (this.state.lat && this.state.lng)
                title = `Vị trí sản phẩm: (${this.state.lat},${this.state.lng})`;
            else title = "Nhập vị trí sản phẩm";
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
                    {this.props.edit_product ? (
                        <div id={this.map_id} className="map_init"></div>
                    ) : (
                        <div id="map_add_product" className="map_init"></div>
                    )}

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
            title = "Tải lên ảnh sản phẩm";
            modal = (
                <React.Fragment>
                    {this.state.images.length
                        ? this.state.images.map((image, index) => (
                              <Image height={300} src={image} key={index} />
                          ))
                        : null}
                    <WidgetLoader />
                    <Widget
                        sources={["local", "url"]}
                        resourceType={"image"}
                        cloudName={"dbzfjnlhl"}
                        uploadPreset={"c8mhcoqp"} // check that an upload preset exists and check mode is signed or unisgned
                        buttonText={"Tải ảnh"} // default 'Upload Files'
                        style={{
                            color: "#fff",
                            border: "none",
                            width: "60px",
                            backgroundColor: "#1890ff",
                            borderRadius: "4px",
                            height: "60px",
                            display: "block",
                            margin: "auto"
                        }} // inline styling only or style id='cloudinary_upload_button'
                        folder={"Sababy"} // set cloudinary folder name to send file
                        cropping={false} // set ability to crop images -> default = true
                        onSuccess={res => this.onAddImage(res)} // add success callback -> returns result
                        onFailure={res => console.log(res)} // add failure callback -> returns 'response.error' + 'response.result'
                        logging={true}
                    />
                </React.Fragment>
            );
            footer = [
                <Button key="back" onClick={() => this.changeModalStep(2)}>
                    Quay lại
                </Button>,
                <Button key="delete-image" onClick={() => this.onDeleteImage()}>
                    Xóa hết ảnh
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => this.handleOk()}
                >
                    {this.props.edit_product ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </Button>
            ];
        }
        return (
            <div className="d-flex justify-content-center">
                {this.props.edit_product ? (
                    <React.Fragment>
                        <Button
                            icon={<EditOutlined />}
                            onClick={e => this.onEditProduct(e)}
                        >
                            Sửa
                        </Button>
                        <div
                            // onKeyDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                            // onFocus={e => e.stopPropagation()}
                            // onMouseOver={e => e.stopPropagation()}
                        >
                            <Modal
                                title={title}
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
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button
                            className="add-product-btn"
                            // type="primary"
                            onClick={() => this.setModalVisible(true)}
                            icon={<PlusOutlined />}
                        >
                            Đăng bán sản phẩm
                        </Button>
                        <Modal
                            title={title}
                            visible={this.state.visible}
                            onOk={() => this.handleOk()}
                            confirmLoading={this.state.confirmLoading}
                            onCancel={() => this.setModalVisible(false)}
                            width={800}
                            footer={footer}
                        >
                            {modal}
                        </Modal>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categoryDetail.categories,
        products: state.productDetail.products,
        currentUser: state.auth.currentUser
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
        addProduct: product => {
            dispatch({
                type: "ADD_PRODUCT",
                payload: product
            });
        },
        updateProducts: product => {
            dispatch({
                type: "UPDATE_PRODUCT",
                payload: product
            });
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AddProductComponent)
);
