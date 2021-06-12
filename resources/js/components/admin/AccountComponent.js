import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/AccountComponent.scss";
import Http from "../../Http";
import { Table, Button, Popconfirm, notification, Space, Input, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

class AccountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            users: [],
            edit: 0,
            name: "",
            phonenumber: "",
            lat: "",
            lng: "",
            inited: false
        };
        this.onDeleteAccount = this.onDeleteAccount.bind(this);
        this.onChangeEditStatus = this.onChangeEditStatus.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePhonenumber = this.onChangePhonenumber.bind(this);
        this.initMap = this.initMap.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
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
                    message: "Xóa tài khoản thành công."
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

    onChangeEditStatus(currentUser) {
        if (currentUser !== 0) { //Neu param là 1 user object -> open edit
            let address = currentUser.address.split(",");
            this.setState({
                edit: currentUser.key,
                name: currentUser.name,
                phonenumber: currentUser.phonenumber,
                lat: parseFloat(address[0]),
                lng: parseFloat(address[1])
            });
        } else {
            //Neu param la 0 -> Close edit
            this.setState({
                edit: 0
            });
        }
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangePhonenumber(e) {
        this.setState({
            phonenumber: e.target.value
        });
    }

    setModalVisible(status) {
        if (!this.state.inited) {
            //Khi chưa init map lần nào (chưa từng mở modal)
            this.setState(
                {
                    visible: true,
                    inited: true
                },
                () => {
                    this.initMap();
                }
            );
        } else {
            // Khi đã init, đóng/mở modal mà k cần init lại
            this.setState({
                visible: status
            });
        }
    }

    initMap() {
        console.log("init map ne");
        if (this.state.visible) {
            let map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 21.0277644, lng: 105.8341598 },
                zoom: 10,
                gestureHandling: "greedy"
            });
            const card = document.getElementById("pac-card");
            const input = document.getElementById("pac-input");
            const options = {
                fields: ["formatted_address", "geometry", "name"],
                origin: map.getCenter(),
                strictBounds: false
            };
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);
            const autocomplete = new google.maps.places.Autocomplete(
                input,
                options
            );
            autocomplete.bindTo("bounds", map);
            const infowindow = new google.maps.InfoWindow();
            const infowindowContent = document.getElementById(
                "infowindow-content"
            );
            infowindow.setContent(infowindowContent);
            var marker = new google.maps.Marker({
                map
            });
            if (this.state.lat && this.state.lng) {
                //Nếu như trước đó đã được chọn vị trí -> hiện marker
                let latLng = { lat: this.state.lat, lng: this.state.lng };
                console.log(latLng);
                infowindow.close();
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                map.setZoom(16);
                infowindowContent.children[
                    "place-name"
                ].textContent = `(${this.state.lat},${this.state.lng})`;
                infowindowContent.children["place-address"].textContent = "";
                infowindow.open(map, marker);
            }
            google.maps.event.addListener(map, "click", e => {
                var latLng = e.latLng;
                this.setState({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                input.value = "";
                map.setZoom(16);
                infowindowContent.children["place-name"].textContent = latLng;
                infowindowContent.children["place-address"].textContent = "";
                infowindow.open(map, marker);
            });
            autocomplete.addListener("place_changed", () => {
                infowindow.close();
                const place = autocomplete.getPlace();
                console.log(place);

                if (!place.geometry || !place.geometry.location) {
                    notification["error"]({
                        message:
                            "Không tìm thấy vị trí " +
                            place.name +
                            " .Vui lòng chọn trên bản đồ."
                    });
                    return;
                }
                this.setState({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map
                });
                map.panTo(marker.getPosition());
                map.setZoom(16);
                infowindowContent.children["place-name"].textContent =
                    place.name;
                infowindowContent.children["place-address"].textContent =
                    place.formatted_address;
                infowindow.open(map, marker);
            });
        }
    }

    onEditSubmit() {
        //state.edit == 0 -> not edit; state.edit == key -> editting record 'key'
        if (
            this.state.name &&
            this.state.phonenumber &&
            this.state.lat &&
            this.state.lng
        ) {
            let uri = "http://localhost:8000/api/user/" + this.state.edit;
            let profile = {
                name: this.state.name,
                phonenumber: this.state.phonenumber,
                address: `${this.state.lat},${this.state.lng}`
            };
            Http.put(uri, profile)
                .then(response => {
                    this.setState(
                        {
                            users: this.state.users.map((user, index) => {
                                //Tìm kiếm và thay thế user được edit
                                if (user.key === this.state.edit) {
                                    user.name = profile.name;
                                    user.phonenumber = profile.phonenumber;
                                    user.address = profile.address;
                                }
                                return user;
                            })
                        },
                        () => this.onChangeEditStatus(0)
                    );
                    notification["success"]({
                        message: "Cập nhật thông tin thành công;"
                    });
                })
                .catch(error =>
                    notification["error"]({
                        message: "Cập nhật thông tin thất bại.",
                        description: error
                    })
                );
        } else {
            notification["error"]({
                message: "Vui lòng nhập đầy đủ thông tin."
            });
        }
    }

    render() {
        console.log(this.state);
        const columns = [
            {
                title: "Tên",
                width: 100,
                dataIndex: "name",
                key: "name",
                fixed: "left",
                render: (text, record) =>
                    this.state.edit == record.key ? (
                        <Input
                            placeholder="Nhập tên"
                            defaultValue={record.name}
                            onChange={e => this.onChangeName(e)}
                        />
                    ) : (
                        record.name
                    )
            },
            {
                title: "Số điện thoại",
                dataIndex: "phonenumber",
                key: "1",
                width: 100,
                render: (text, record) =>
                    this.state.edit == record.key ? (
                        <Input
                            placeholder="Nhập số điện thoại"
                            defaultValue={record.phonenumber}
                            onChange={e => this.onChangePhonenumber(e)}
                        />
                    ) : (
                        record.phonenumber
                    )
            },
            {
                title: "Địa chỉ",
                dataIndex: "address",
                key: "2",
                width: 180,
                render: (text, record) =>
                    this.state.edit == record.key ? (
                        <Button onClick={() => this.setModalVisible(true)}>
                            {record.address}
                        </Button>
                    ) : record.address
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
                width: 80,
                render: (text, record) =>
                    this.state.edit == record.key ? (
                        <div className="submit-btn d-flex justify-content-center">
                            <Space>
                                <Button
                                    onClick={() => this.onChangeEditStatus(0)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    key="submit"
                                    type="primary"
                                    onClick={() => this.onEditSubmit()}
                                >
                                    Xác nhận
                                </Button>
                            </Space>
                        </div>
                    ) : (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => this.onChangeEditStatus(record)}
                        >
                            Sửa
                        </Button>
                    )
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
                <Modal
                    title="Xác định vị trí của bạn"
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
                    width={1000}
                >
                    <div className="pac-card" id="pac-card">
                        <div id="pac-container">
                            <input
                                id="pac-input"
                                type="text"
                                placeholder="Nhập vị trí của bạn"
                            />
                        </div>
                    </div>
                    <div id="map" className="map_init"></div>
                    <div id="infowindow-content">
                        <span id="place-name" className="title"></span>
                        <br />
                        <span id="place-address"></span>
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
    connect(mapStateToProps, mapDispatchToProps)(AccountComponent)
);
