import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Spin, Select } from "antd";
import "./css/ProductSearch.scss";
import ProductCard from "./ProductCard";
import DistanceSort from "../homepage/DistanceComponent";
import { connect } from "react-redux";

const queryString = require("query-string");
const { Option } = Select;

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            keyword: "",
            cities: []
        };
        this.getProductSearchResult = this.getProductSearchResult.bind(this);
        this.handleBookmark = this.handleBookmark.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.getCityList = this.getCityList.bind(this);
    }
    componentDidMount() {
        this.getProductSearchResult();
        this.getCityList();
    }
    componentDidUpdate(prevProps) {
        if (
            location.search !== undefined &&
            location.search !== prevProps.location.search
        ) {
            this.getProductSearchResult();
        }
    }
    getCityList() {
        Http.defaults.headers.common["token"] =
            "08ed659a-4f05-11eb-b7e7-eeaa791b204b";
        Http.get(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/province"
        )
            .then(response => {
                if (response.data) {
                    this.setState({ cities: response.data.data });
                } else {
                    console.log("Lấy danh sách tỉnh thành phố thất bại.");
                }
            })
            .catch(error => {
                console.log(error.response.status);
            });
    }
    onCityChange(value) {
        console.log(value);
        const condition = queryString.parse(location.search);
        if(value === "Toàn quốc"){
            if(condition.city){
                delete condition.city;
            }else{
                return;
            }
        }else{
            condition.city = value;
        }
        let stringified = queryString.stringify(condition);
        if(stringified) stringified = '?' + stringified;
        this.props.history.push({
            pathname: "/search",
            search: stringified
        });
    }

    getProductSearchResult() {
        const condition = queryString.parse(location.search);
        this.setState({ keyword: condition.k });
        const uri = "http://localhost:8000/api/product/filter";
        const request = {
            product_name: condition.k,
            city: condition.city
        };
        console.log(request);
        Http.post(uri, request).then(response => {
            if (response) {
                this.props.setProducts(response.data);
                this.setState({ isLoading: false });
            } else {
                console.log("Tìm kiếm thất bại");
            }
        });
    }

    handleBookmark(bookmark, index) {
        console.log("handle Bookmark");
        console.log(index);
        console.log(this.props);
        // this.props.setBookmark(bookmark, index);
    }
    render() {
        return (
            <div className="homepage-body">
                {!this.state.isLoading ? (
                    <div className="container">
                        {this.props.products ? (
                            <React.Fragment>
                                <div className="filter-and-sort d-flex justify-content-end">
                                    <Select
                                        showSearch
                                        style={{ width: 110 }}
                                        placeholder="Toàn quốc"
                                        optionFilterProp="children"
                                        onChange={this.onCityChange}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                    >
                                        <Option value="Toàn quốc">Toàn quốc</Option>
                                        {
                                            this.state.cities ? (
                                                this.state.cities.map((city, index) => (
                                                    <Option value={city.ProvinceName}>{city.ProvinceName}</Option>
                                                ))
                                            ) : null
                                        }
                                    </Select>
                                    <DistanceSort
                                        setProducts={this.props.setProducts}
                                    />
                                </div>
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
                                                        setBookmark={
                                                            this.handleBookmark
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className="search-result-text">
                                Không có kết quả tìm kiếm cho từ khóa '
                                <strong>{this.state.keyword}</strong>'
                            </div>
                        )}
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
        },
        setBookmark: (bookmark, index) => {
            dispatch({
                type: "SET_BOOKMARK",
                payload: bookmark,
                index: index
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
