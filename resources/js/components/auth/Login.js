import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Http from "../../Http";
import $ from "jquery";
import "./css/login.scss";
import { notification } from "antd";
import { connect } from "react-redux";
import ChangePassword from "./ChangePassword"

class Login extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePhonenumber = this.onChangePhonenumber.bind(this);
        this.onSignupSubmit = this.onSignupSubmit.bind(this);
        this.onLoginSubmit = this.onLoginSubmit.bind(this);

        this.state = {
            username: "",
            password: "",
            phonenumber: "",
            loading: true
        };
    }

    componentDidMount() {
        function checkPasswordMatch() {
            var password = $("#new_password").val();
            var confirmPassword = $("#confirm_password").val();
            if (confirmPassword === "")
                $("#confirm-password-error-message").empty();
            else if (password !== confirmPassword) {
                $("#confirm-password-error-message").html(
                    "Password do not match! Please enter again"
                );
                $("#signup-button").prop("disabled", true);
            } else {
                $("#confirm-password-error-message").html("Password match <3");
                $("#signup-button").prop("disabled", false);
            }
        }

        $(document).ready(function() {
            $("#confirm_password").keyup(checkPasswordMatch);
            $("#new_password").keyup(checkPasswordMatch);
        });

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

        $(".tab h2").on("click", function(e) {
            e.preventDefault();
            $(this)
                .parent()
                .addClass("active");
            $(this)
                .parent()
                .siblings()
                .removeClass("active");

            var target = $(this).attr("name");
            console.log(target);
            $(".tab-content > div")
                .not(target)
                .hide();

            $(target).fadeIn(600);
        });
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangePhonenumber(e) {
        this.setState({
            phonenumber: e.target.value
        });
    }

    onSignupSubmit(e) {
        e.preventDefault();
        let uri = process.env.MIX_API_URL + "api/user/register";
        const newUser = {
            name: this.state.username,
            password: this.state.password,
            phonenumber: this.state.phonenumber
        };
        Http.post(uri, newUser).then(response => {
            if (response.data.success) {
                console.log(response);
                window.location.reload();
                notification["success"]({
                    message: "Đăng ký tài khoản thành công."
                });
            } else {
                console.log(response);
                notification["error"]({
                    message: "Đăng ký tài khoản thất bại."
                });
            }
        });
        this.setState({
            username: "",
            password: ""
        });
    }

    onLoginSubmit(e) {
        e.preventDefault();
        let uri = process.env.MIX_API_URL + "api/user/login";
        const loginUser = {
            phonenumber: this.state.phonenumber,
            password: this.state.password
        };
        Http.post(uri, loginUser).then(response => {
            if (response.data.success) {
                this.props.login(response.data.user);
                this.setState({ loading: false });
                localStorage.setItem("auth_token", response.data.user.auth_token);
                Http.defaults.headers.common["Authorization"] =
                    "Bearer " + response.data.user.auth_token;
                if (!this.state.loading) {
                    this.setState({
                        username: "",
                        password: "",
                        phonenumber: ""
                    });
                }
                if (response.data.user.is_admin) {
                    this.props.history.push("/admin");
                } else {
                    // if (window.history.length > 1) {
                    //     window.history.back();
                    // } else {
                        this.props.history.push("/");
                    // }
                }
            }else{
                notification["error"]({
                    message: "Đăng nhập thất bại"
                });
            }
        });
    }
    render() {
        return (
            <div className="login-app">
                <div className="form">
                    <ul className="tab-group">
                        <li className="tab">
                            <h2 name="#signup">
                                <Link to="">Đăng ký</Link>
                            </h2>
                        </li>
                        <li className="tab active">
                            <h2 name="#login">
                                <Link to="">Đăng nhập</Link>
                            </h2>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div id="login">
                            <h1>Hãy tận hưởng dịch vụ của Sababy!</h1>

                            <form onSubmit={this.onLoginSubmit}>
                                <div className="field-wrap">
                                    <label>
                                        Số điện thoại<span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={this.state.phonenumber}
                                        onChange={e => this.onChangePhonenumber(e)}
                                        name="phonenumber"
                                    />
                                </div>

                                <div className="field-wrap">
                                    <label>
                                        Mật khẩu<span className="req">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        onChange={e => this.onChangePassword(e)}
                                        name="password"
                                    />
                                </div>

                                <ChangePassword />

                                <button
                                    id="login-button"
                                    type="submit"
                                    className="button button-block"
                                >
                                    Đăng nhập
                                </button>
                            </form>
                        </div>

                        <div id="signup">
                            <h1>Đăng ký tài khoản chỉ với 20 giây</h1>

                            <form onSubmit={this.onSignupSubmit}>
                                <div className="field-wrap">
                                    <label>
                                        Tên người dùng
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        onChange={e => this.onChangeUsername(e)}
                                        name="username"
                                        minLength="3"
                                    />
                                </div>

                                <div className="field-wrap">
                                    <label>
                                        Số điện thoại<span className="req">*</span>
                                    </label>
                                    <input
                                        type="phonenumber"
                                        required
                                        onChange={e => this.onChangePhonenumber(e)}
                                    />
                                </div>

                                <div className="field-wrap">
                                    <label>
                                        Mật khẩu<span className="req">*</span>
                                    </label>
                                    <input
                                        id="new_password"
                                        type="password"
                                        required
                                        onChange={e => this.onChangePassword(e)}
                                        name="password"
                                    />
                                </div>

                                <div className="field-wrap">
                                    <label>
                                        Nhập lại mật khẩu
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        id="confirm_password"
                                        type="password"
                                        required
                                        autoComplete="off"
                                        onChange="checkPasswordMatch();"
                                    />
                                    <div id="confirm-password-error-message"></div>
                                </div>

                                <button
                                    id="signup-button"
                                    type="submit"
                                    className="button button-block"
                                >
                                    Tạo tài khoản
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

export default connect(null, mapDispatchToProps)(Login);
