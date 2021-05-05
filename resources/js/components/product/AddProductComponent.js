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
        this.setState({ modal_step: step });
    }

    setModalVisible(status) {
        if (status === true && !this.props.categories) {
            const uri = "http://localhost:8000/api/category";
            Http.get(uri).then(response => {
                this.props.setCategories(response.data);
            });
        }
        if (status === false) {
            this.setState({ visible: status, modal_step: 1 });
        } else {
            this.setState({ visible: status });
        }
    }

    setConfirmLoading(status) {
        this.setState({ confirmLoading: status });
    }

    handleOk() {
        this.setConfirmLoading(true);
        if (this.state.modal_step === 3) {
            console.log("Save to db");
            this.setModalVisible(false);
            this.setConfirmLoading(false);
        } else {
            this.setState({ modal_step: this.state.modal_step + 1 });
        }
    }
    render() {
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
                    <Form.Item label="Danh mục">
                        <Cascader
                            placeholder="Lựa chọn danh mục sản phẩm"
                            options={categories}
                            onChange={this.onChangeCategory}
                        />
                    </Form.Item>
                    <Form.Item label="Tên sản phẩm">
                        <Input
                            onChange={this.onChangeProductName}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả">
                        <TextArea
                            rows={4}
                            onChange={this.onChangeDescription}
                            placeholder="Thông tin của sản phẩm như kích cỡ, chất liệu, màu sắc, xuất xứ, thương hiệu,..."
                        />
                    </Form.Item>
                    <Form.Item label="Giá tiền (VND)">
                        <InputNumber
                            min={1}
                            step={50000}
                            onChange={this.onChangePrice}
                        />
                    </Form.Item>
                    <Form.Item label="Số lượng">
                        <InputNumber
                            defaultValue={1}
                            min={1}
                            onChange={this.onChangeQuantity}
                        />
                    </Form.Item>
                    <Form.Item label="Tình trạng ngoại quan">
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết tình trạng bên ngoài của sản phẩm như xước nhẹ ở vị trí nào, bị ngả màu vàng ố hay không,..."
                            onChange={this.onChangeOutsideStatus}
                        />
                    </Form.Item>
                    <Form.Item label="Tình trạng chức năng">
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết tình trạng về khả năng sử dụng sản phẩm như: sử dụng còn tốt, có tiếng kêu nhỏ khi di chuyển (xe đẩy),...."
                            onChange={this.onChangeFunctionStatus}
                        />
                    </Form.Item>
                </Form>
            );
        } else if (this.state.modal_step === 2) {
            modal = <p>ahihihihi 2</p>;
        } else {
            modal = <p>ahihihi 3</p>;
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
                    footer={[
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
                            {this.state.modal_step === 3
                                ? "Thêm sản phẩm"
                                : "Tiếp theo"}
                        </Button>
                    ]}
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
