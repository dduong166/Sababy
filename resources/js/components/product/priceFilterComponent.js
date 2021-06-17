import React, { Component } from "react";
import Http from "../../Http";
import "./css/PriceFilterComponent.scss";
import { Modal, Button, Slider, InputNumber, Space } from "antd";
import "antd/dist/antd.css";
import { contains } from "jquery";

const queryString = require("query-string");

class PriceFilterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            min: 100000,
            max: 200000,
            is_set_range: false,
            visible: false
        };
        this.setModalVisible = this.setModalVisible.bind(this);
        this.filterByPrice = this.filterByPrice.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onChangeMin = this.onChangeMin.bind(this);
        this.onChangeMax = this.onChangeMax.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        const condition = queryString.parse(location.search);
        if (condition.price) {
            condition.price = condition.price.split("-");
            this.setState({
                is_set_range: true,
                min: condition.price[0],
                max: condition.price[1]
            });
        }
    }

    setModalVisible(status) {
        this.setState({
            visible: status
        });
    }

    onPriceChange(value) {
        if (value[0] < value[1]) {
            this.setState({ min: value[0], max: value[1] });
        }
    }
    onChangeMin(value) {
        if (this.state.max > value) {
            this.setState({ min: value });
        }
    }
    onChangeMax(value) {
        if (this.state.min < value) {
            this.setState({ max: value });
        }
    }
    onReset() {
        this.setState({
            is_set_range: false,
            max: 200000,
            min: 100000,
            visible: false
        });
        const condition = queryString.parse(location.search);
        condition.page = 1;
        if (condition.price) {
            delete condition.price;
            let stringified = queryString.stringify(condition);
            if (stringified) stringified = "?" + stringified;
            this.props.history.push({
                pathname: location.pathname,
                search: stringified
            });
        }
    }

    filterByPrice() {
        this.setState({ is_set_range: true });
        this.setModalVisible(false);
        const condition = queryString.parse(location.search);
        condition.page = 1;
        condition.price = `${this.state.min}-${this.state.max}`;
        let stringified = queryString.stringify(condition);
        if (stringified) stringified = "?" + stringified;
        this.props.history.push({
            pathname: location.pathname,
            search: stringified
        });
    }

    render() {
        let footer;
        if (this.state.is_set_range) {
            footer = [
                <Button
                    key="cancel"
                    onClick={() => this.setModalVisible(false)}
                >
                    Đóng
                </Button>,
                <Button key="reset" onClick={this.onReset}>
                    Bỏ lọc
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => this.filterByPrice()}
                >
                    Xác nhận
                </Button>
            ];
        } else {
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
                    onClick={() => this.filterByPrice()}
                >
                    Xác nhận
                </Button>
            ];
        }
        return (
            <div className="price-filter">
                {this.state.is_set_range ? (
                    <Button onClick={() => this.setModalVisible(true)} danger>
                        {this.state.min} ~ {this.state.max} đ
                    </Button>
                ) : (
                    <Button onClick={() => this.setModalVisible(true)}>
                        Giá tiền
                    </Button>
                )}

                <Modal
                    title="Lựa chọn khoảng giá"
                    width="500px"
                    centered
                    visible={this.state.visible}
                    footer={footer}
                    onOk={() => this.filterByPrice()}
                    onCancel={() => this.setModalVisible(false)}
                    width={500}
                >
                    <div className="price-range container">
                        <Slider
                            className="slider-main-div"
                            min={0}
                            max={3000000}
                            onChange={this.onPriceChange}
                            range={true}
                            step={100000}
                            defaultValue={[this.state.min, this.state.max]}
                        />
                        <div className="range-input-number-main d-flex justify-content-center align-items-center">
                            <Space>
                                <InputNumber
                                    className="min-input-main"
                                    min={0}
                                    max={5000000}
                                    step={50000}
                                    value={this.state.min}
                                    onChange={this.onChangeMin}
                                />
                                <span className="range-span"> ~ </span>
                                <InputNumber
                                    className="min-input-main"
                                    min={0}
                                    max={5000000}
                                    step={50000}
                                    value={this.state.max}
                                    onChange={this.onChangeMax}
                                />
                                <span className="range-span"> đ </span>
                            </Space>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default PriceFilterComponent;
