import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/AccountComponent.scss";
import Http from "../../Http";
import { Table, Button, Popconfirm, notification } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

class AccountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            users: []
        };
        this.onDeleteAccount = this.onDeleteAccount.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    onDeleteAccount(key) {
        this.setState({ isLoading: true });
        const uri = `http://localhost:8000/api/admin/user/${key}`;
        Http.delete(uri)
            .then(response => {
                notification["success"]({
                    message: "Xóa sản phẩm thành công."
                });
                this.setState({
                    isLoading: false,
                    users: this.state.users.filter(function(user) {
                        return user.key !== key;
                    })
                });
            })
            .catch(error => {
                this.setState({ isLoading: false });
                notification["error"]({
                    message: "Xóa tài khoản thất bại"
                });
            });
    }

    getUsers() {
        const uri = "http://localhost:8000/api/admin/users";
        Http.get(uri).then(response => {
            this.setState({
                users: response.data,
                isLoading: false
            });
        });
    }

    render() {
        console.log(this.state);
        const columns = [
            {
                title: "Tên",
                width: 100,
                dataIndex: "name",
                key: "name",
                fixed: "left"
            },
            {
                title: "Email",
                width: 100,
                dataIndex: "email",
                key: "email",
                fixed: "left"
            },
            {
                title: "Số điện thoại",
                dataIndex: "phonenumber",
                key: "1",
                width: 100
            },
            {
                title: "Địa chỉ",
                dataIndex: "address",
                key: "2",
                width: 180
            },
            {
                title: "Ngày đăng ký",
                dataIndex: "created_at_date",
                key: "3",
                width: 100
            },
            {
                title: "Sửa",
                key: "operation",
                fixed: "right",
                width: 50,
                render: () => <Button icon={<EditOutlined />}>Sửa</Button>
            },
            {
                title: "Xóa",
                key: "operation",
                fixed: "right",
                width: 50,
                render: (text, record) => (
                    <div onClick={e => e.stopPropagation()}>
                        <Popconfirm
                            placement="top"
                            title="Bạn muốn xóa tài khoản này?"
                            onConfirm={() => this.onDeleteAccount(record.key)}
                            okText="Xóa"
                            cancelText="Quay lại"
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];

        return (
            <div className="admin-accounts">
                <Table
                    columns={columns}
                    dataSource={this.state.users}
                    scroll={{ x: 1000, y: 400 }}
                    loading={this.state.isLoading}
                />
                ,
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
    connect(mapStateToProps, mapDispatchToProps)(AccountComponent)
);
