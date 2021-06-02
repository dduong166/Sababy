import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Http from "../../Http";
import $ from "jquery";
import "./css/Login.scss";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import { connect } from "react-redux";

class AdminLogin extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onLoginSubmit = this.onLoginSubmit.bind(this);

        this.state = {
            password: "",
            email: "",
            loading: true
        };
    }

    componentDidMount() {
        $(".form")
            .find("input, textarea")
            .on("keyup blur focus", function(e) {
                var $this = $(this),
                    label = $this.prev("label");

                if (e.type === "keyup") {
                    if ($this.val() === "") {
                        label.removeClass("active highlight");
                    } else {
                        label.addClass("active highlight");
                    }
                } else if (e.type === "blur") {
                    if ($this.val() === "") {
                        label.removeClass("active highlight");
                    } else {
                        label.removeClass("highlight");
                    }
                } else if (e.type === "focus") {
                    if ($this.val() === "") {
                        label.removeClass("highlight");
                    } else if ($this.val() !== "") {
                        label.addClass("highlight");
                    }
                }
            });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onLoginSubmit(e) {
        e.preventDefault();
        let uri = "http://localhost:8000/api/user/login";
        const loginUser = {
            email: this.state.email,
            password: this.state.password,
            is_admin: 1
        };
        Http.post(uri, loginUser).then(response => {
            if (response.data.success) {
                var currentUser = {
                    id: response.data.user_id,
                    name: response.data.username
                };
                this.props.login(currentUser);
                this.setState({ loading: false });
                localStorage.setItem("auth_token", response.data.auth_token);
                Http.defaults.headers.common["Authorization"] =
                    "Bearer " + response.data.auth_token;
                if (!this.state.loading) {
                    this.setState({
                        username: "",
                        password: "",
                        email: ""
                    });
                }

                this.props.history.push("/admin/");
            }
        });
        console.log(this.state);
    }
    render() {
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 }
        };
        return (
            <div className="admin-login">
                <div className="form">
                    <div className="tab-content">
                        <div id="login">
                            <h1>Giao diện dành cho quản trị viên</h1>

                            <form onSubmit={this.onLoginSubmit}>
                                <div className="field-wrap">
                                    <label>
                                        Email<span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        name="email"
                                    />
                                </div>

                                <div className="field-wrap">
                                    <label>
                                        Mật khẩu<span className="req">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        onChange={this.onChangePassword}
                                        name="password"
                                    />
                                </div>

                                <button
                                    id="login-button"
                                    type="submit"
                                    className="button button-block"
                                >
                                    Đăng nhập
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: username => {
            dispatch({
                type: "LOGIN",
                payload: username
            });
        }
    };
};

export default connect(null, mapDispatchToProps)(AdminLogin);
