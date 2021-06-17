import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/ChangePassword.scss";
import Http from "../../Http";
import { notification, Input, Modal, Button } from "antd";
import { connect } from "react-redux";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            phonenumber: true,
            password: "",
            newPassword: "",
            newPasswordConfirm: "",
            visible: false
        };
        this.setModalVisible = this.setModalVisible.bind(this);
        this.onChangePhonenumber = this.onChangePhonenumber.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onChangeConfirmNewPassword = this.onChangeConfirmNewPassword.bind(
            this
        );
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    setModalVisible(status) {
        this.setState({
            visible: status
        });
    }

    onChangePhonenumber(e) {
        this.setState({
            phonenumber: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeNewPassword(e) {
        this.setState({
            newPassword: e.target.value
        });
    }

    onChangeConfirmNewPassword(e) {
        this.setState({
            newPasswordConfirm: e.target.value
        });
    }

    onOk() {
        if (
            !this.state.password ||
            !this.state.newPassword ||
            !this.state.newPasswordConfirm
        ) {
            notification["error"]({
                message: "Vui lòng nhập đầy đủ thông tin."
            });
        } else if (this.state.newPassword !== this.state.newPasswordConfirm) {
            notification["error"]({
                message:
                    "Vui lòng nhập xác nhận mật khẩu giống với mật khẩu mới."
            });
        } else {
            let uri = process.env.MIX_API_URL + "api/user/password";
            let password_profile = {
                phonenumber: this.state.phonenumber,
                password: this.state.password,
                newPassword: this.state.newPassword,
                newPasswordConfirm: this.state.newPasswordConfirm
            };
            Http.put(uri, password_profile)
                .then(response => {
                    if (response.data.data) {
                        notification["success"]({
                            message: "Đổi mật khẩu thành công."
                        });
                        this.setModalVisible(false);
                    } else {
                        notification["error"]({
                            message: response.data.message
                        });
                    }
                })
                .catch(error =>
                    notification["error"]({
                        message: error
                    })
                );
        }
    }

    render() {
        console.log(this.state);
        return (
            <div className="change-password">
                <p
                    className="forgot"
                    onClick={() => this.setModalVisible(true)}
                >
                    Đổi mật khẩu
                </p>
                <Modal
                    title="Đổi mật khẩu"
                    centered
                    visible={this.state.visible}
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
                            onClick={() => this.onOk()}
                        >
                            Xác nhận
                        </Button>
                    ]}
                    onOk={() => this.onOk()}
                    onCancel={() => this.setModalVisible(false)}
                    width={800}
                >
                    <div className="change-password-form container d-flex justify-content-center">
                        <table>
                            <tbody>
                                <tr>
                                    <th>SỐ ĐIỆN THOẠI</th>
                                    <td>
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            onChange={e =>
                                                this.onChangePhonenumber(e)
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>MẬT KHẨU HIỆN TẠI</th>
                                    <td>
                                        <Input.Password
                                            placeholder="Nhập mật khẩu hiện tại"
                                            onChange={e =>
                                                this.onChangePassword(e)
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>MẬT KHẨU MỚI</th>
                                    <td>
                                        <Input.Password
                                            placeholder="Nhập mật khẩu mới"
                                            onChange={e =>
                                                this.onChangeNewPassword(e)
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>NHẬP LẠI MẬT KHẨU MỚI</th>
                                    <td>
                                        <Input.Password
                                            placeholder="Nhập lại mật khẩu mới"
                                            onChange={e =>
                                                this.onChangeConfirmNewPassword(
                                                    e
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.currentUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch({
                type: "LOGOUT"
            });
        },
        login: username => {
            dispatch({
                type: "LOGIN",
                payload: username
            });
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
);
