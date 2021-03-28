import React, { Component } from "react";
import Http from "../../Http";
import { Link, withRouter } from "react-router-dom";
import { Spin, Select } from "antd";
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
            isLoading: false, 
            keyword: "",
            cities: []
        };
        this.handleBookmark = this.handleBookmark.bind(this);
        this.setStateKeyword = this.setStateKeyword.bind(this);

    }
    componentDidMount() {
        const condition = queryString.parse(location.search);
        this.setStateKeyword(condition.k);
    }
    componentWillUnmount() {
        this.props.history.push({
            search: ""
        });
    }
    setStateKeyword(value){
        this.setState({ keyword: value });
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
                        <FilterSort location={this.props.location} history={this.props.history} setStateKeyword={this.setStateKeyword}/>
                        {this.props.products ? (
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
                                            {
                                                this.props.isLoading && 'loading....'
                                            }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Homepage));
