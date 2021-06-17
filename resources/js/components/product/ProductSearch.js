import React, { Component } from "react";
import Http from "../../Http";
import { Link, withRouter } from "react-router-dom";
import { Spin, Select, Pagination } from "antd";
import "./css/ProductSearch.scss";
import ProductCard from "./ProductCard";
import FilterSort from "./FilterSortComponent";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const queryString = require("query-string");
const { Option } = Select;

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            keyword: "",
            defaultCurrent: 1,
            totalItem: 1,
            pageSize: 12,
            cities: []
        };
        this.setStateKeyword = this.setStateKeyword.bind(this);
        this.changeLoading = this.changeLoading.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.changePagination = this.changePagination.bind(this);
    }
    componentDidMount() {
        const condition = queryString.parse(location.search);
        this.setStateKeyword(condition.k);
        if (condition.page) {
            this.setState({
                defaultCurrent: Number(condition.page)
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (
            location.search !== undefined &&
            location.search !== prevProps.location.search
        ) {
            const condition = queryString.parse(location.search);
            this.setStateKeyword(condition.k);
            if (condition.page) {
                this.setState({
                    defaultCurrent: Number(condition.page)
                });
            }
        }
    }

    componentWillUnmount() {
        this.props.history.push({
            search: ""
        });
    }
    setStateKeyword(value) {    //dùng để hiển thị keyword ra ngoài
        this.setState({ keyword: value });
    }

    changeLoading(value) {
        this.setState({ isLoading: value });
    }

    onPageChange(page) {    //page change when click in Pagination
        this.setState({
            defaultCurrent: page
        });
        const condition = queryString.parse(location.search);
        condition.page = page;
        let stringified = queryString.stringify(condition);
        if (stringified) stringified = "?" + stringified;
        this.props.history.push({
            pathname: location.pathname,
            search: stringified
        });
    }

    changePagination(totalItem, pageSize) { // nhận 1 số thông tin về Pagination sau khi nhận dữ liệu từ hàm filter
        this.setState({
            totalItem: totalItem,
            pageSize: pageSize
        });
    }

    render() {
        console.log(this.state);
        return (
            <div className="homepage-body fullscreen-min-height">
                <div className="container">
                    <FilterSort
                        location={this.props.location}
                        history={this.props.history}
                        changeLoading={value => this.changeLoading(value)}
                        changeKeyword={value => this.setStateKeyword(value)}
                        changePagination={(totalItem, pageSize) =>
                            this.changePagination(totalItem, pageSize)
                        }
                        isLoading={this.state.isLoading}
                    />
                    {!this.state.isLoading ? (
                        this.props.products.length ? (
                            <React.Fragment>
                                {this.state.keyword ? (
                                    <div className="search-result-text">
                                        Kết quả tìm kiếm cho từ khóa '
                                        <strong>{this.state.keyword}</strong>'
                                    </div>
                                ) : (
                                    <h3 className="trending_title">
                                        TẤT CẢ SẢN PHẨM
                                    </h3>
                                )}
                                <div className="product-list">
                                    <div className="container">
                                        <div className="row">
                                            {this.props.products.map(
                                                (product, index) => (
                                                    <ProductCard
                                                        key={product.id}
                                                        product={product}
                                                        index={index}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="pagination d-flex justify-content-end">
                                    <Pagination
                                        defaultCurrent={
                                            this.state.defaultCurrent
                                        }
                                        total={this.state.totalItem}
                                        pageSize={this.state.pageSize}
                                        onChange={page =>
                                            this.onPageChange(page)
                                        }
                                    />
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className="search-result-text">
                                Không có kết quả tìm kiếm cho từ khóa '
                                <strong>{this.state.keyword}</strong>'
                            </div>
                        )
                    ) : (
                        <div className="loading d-flex justify-content-center align-items-center">
                            <Spin />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        products: state.productDetail.products,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setProducts: products => {
            dispatch({
                type: "SET_PRODUCTS",
                payload: products
            });
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Homepage)
);
