import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Spin, Button, Modal, Form, Input, Cascader, InputNumber} from "antd";
import "./css/MyProducts.scss";
import { connect } from "react-redux";
import moment from "moment";

const { TextArea } = Input;

class MyProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            quantity: 1
        };
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setConfirmLoading = this.setConfirmLoading.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    onChangeQuantity(value) {
        this.setState({quantity: value});
    }

    setModalVisible(status) {
        this.setState({ visible: status });
    }

    setConfirmLoading(status) {
        this.setState({ confirmLoading: status });
    }

    handleOk() {
        this.setConfirmLoading(true);
        setTimeout(() => {
            this.setModalVisible(false);
            this.setConfirmLoading(false);
        }, 2000);
    }
    render() {
        console.log(this.state);
        return (
            <div className="my-products-page container">
                <div className="my-products-banner">
                    <h2>SẢN PHẨM</h2>
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
                                    id="nav-onsale-tab"
                                    data-toggle="tab"
                                    href="#nav-onsale"
                                    role="tab"
                                    aria-controls="nav-onsale"
                                    aria-selected="true"
                                >
                                    ĐANG RAO BÁN
                                </a>
                                <a
                                    className="nav-item nav-link"
                                    id="nav-sold-tab"
                                    data-toggle="tab"
                                    href="#nav-sold"
                                    role="tab"
                                    aria-controls="nav-sold"
                                    aria-selected="false"
                                >
                                    ĐÃ BÁN
                                </a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="nav-onsale"
                                role="tabpanel"
                                aria-labelledby="nav-onsale-tab"
                            >
                                <div className="add-product-btn d-flex justify-content-end">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            this.setModalVisible(true)
                                        }
                                    >
                                        Thêm sản phẩm mới
                                    </Button>
                                    <Modal
                                        title="Thêm sản phẩm mới"
                                        visible={this.state.visible}
                                        onOk={() => this.handleOk()}
                                        confirmLoading={
                                            this.state.confirmLoading
                                        }
                                        onCancel={() =>
                                            this.setModalVisible(false)
                                        }
                                    >
                                        <Form
                                            labelCol={{
                                                span: 6
                                            }}
                                            wrapperCol={{
                                                span: 14
                                            }}
                                            layout="horizontal"
                                        >
                                            <Form.Item label="Tên sản phẩm">
                                                <Input />
                                            </Form.Item>
                                            <Form.Item label="Danh mục">
                                                <Cascader
                                                    placeholder="Lựa chọn danh mục sản phẩm"
                                                    options={[
                                                        {
                                                            value: "zhejiang",
                                                            label: "Zhejiang",
                                                            children: [
                                                                {
                                                                    value:
                                                                        "hangzhou",
                                                                    label:
                                                                        "Hangzhou"
                                                                }
                                                            ]
                                                        }
                                                    ]}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Số lượng">
                                                <InputNumber defaultValue={1} min={1} onChange={this.onChangeQuantity}/>
                                            </Form.Item>
                                            <Form.Item label="Mô tả">
                                                <TextArea rows={4}/>
                                            </Form.Item>
                                            <Form.Item label="Giá tiền (VND)">
                                                <InputNumber min={1} onChange={this.onChangeQuantity}/>
                                            </Form.Item>
                                        </Form>
                                    </Modal>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="nav-sold"
                                role="tabpanel"
                                aria-labelledby="nav-sold-tab"
                            >
                                blah blha
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         setProductDetail: detail => {
//             dispatch({
//                 type: "SET_PRODUCT_DETAIL",
//                 payload: detail
//             });
//         }
//     };
// };

export default connect(mapStateToProps, null)(MyProducts);
