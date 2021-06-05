import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./css/profile.scss";
import Http from "../../Http";
import { Button, Input, Modal, notification, Space, Tooltip } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: 0,
            name: "",
            email: "",
            phonenumber: "",
            address: "",
            lat: null,
            lng: null,
            visible: false,
            inited: false,
            isLoading: true,
            isSetValueToState: false
        };
        this.onChangeEditStatus = this.onChangeEditStatus.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePhonenumber = this.onChangePhonenumber.bind(this);
        this.initMap = this.initMap.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
    }

    onChangeEditStatus(value) {
        this.setState({
            edit: value
        });
    }

    onEditSubmit() {
        if (
            this.state.name &&
            this.state.email &&
            this.state.phonenumber &&
            this.state.lat &&
            this.state.lng
        ) {
            let uri =
                "http://localhost:8000/api/user/" + this.props.currentUser.id;
            let profile = {
                name: this.state.name,
                email: this.state.email,
                phonenumber: this.state.phonenumber,
                address: `${this.state.lat},${this.state.lng}`
            };
            Http.put(uri, profile)
                .then(response => {
                    console.log(response.data);
                    this.props.login(response.data);
                })
                .catch(error => console.log(error));
            this.onChangeEditStatus(0);
        } else {
            notification["error"]({
                message: "Vui lòng nhập đầy đủ thông tin."
            });
        }
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
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

    onOk() {
        console.log("okok", this.state);
        if (this.state.lat && this.state.lng) {
            this.setModalVisible(false);
        } else {
            notification["error"]({
                message:
                    "Hãy xác định vị trí của bạn bằng cách tìm kiếm địa điểm hoặc chọn trên bản đồ."
            });
        }
    }

    render() {
        console.log(this.state);
        let currentUser = this.props.currentUser;
        if (currentUser && !this.state.isSetValueToState) {
            let address = currentUser.address.split(",");
            this.setState({
                name: currentUser.name,
                email: currentUser.email,
                phonenumber: currentUser.phonenumber,
                lat: parseFloat(address[0]),
                lng: parseFloat(address[1]),
                isSetValueToState: true
            });
        }
        return (
            <div className="profile container">
                <div className="profile-banner">
                    <h2>THÔNG TIN CÁ NHÂN</h2>
                </div>
                {!this.state.edit ? (
                    <div className="edit-btn d-flex justify-content-center">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => this.onChangeEditStatus(1)}
                        >
                            Sửa
                        </Button>
                    </div>
                ) : null}
                <table>
                    <tbody>
                        <tr>
                            <th>TÊN NGƯỜI DÙNG</th>
                            <td>
                                {this.state.edit ? (
                                    <Input
                                        placeholder="Nhập tên người dùng"
                                        defaultValue={currentUser.name}
                                        onChange={e => this.onChangeName(e)}
                                    />
                                ) : (
                                    currentUser.name
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>ĐỊA CHỈ EMAIL</th>
                            <td>
                                {this.state.edit ? (
                                    <Input
                                        placeholder="Nhập email"
                                        defaultValue={currentUser.email}
                                        onChange={e => this.onChangeEmail(e)}
                                    />
                                ) : (
                                    currentUser.email
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>SỐ ĐIỆN THOẠI <Tooltip title="Người mua sẽ liên hệ với bạn thông qua số điện thoại này"><InfoCircleOutlined /></Tooltip></th>
                            <td>
                                {this.state.edit ? (
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        defaultValue={currentUser.phonenumber}
                                        onChange={e =>
                                            this.onChangePhonenumber(e)
                                        }
                                    />
                                ) : (
                                    currentUser.phonenumber
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>TỌA ĐỘ ĐỊA CHỈ <Tooltip title="Thông tin này phục vụ cho chức năng sắp xếp sản phẩm theo khoảng cách và không được công khai"><InfoCircleOutlined /></Tooltip></th>
                            <td>
                                {this.state.edit ? (
                                    <Button
                                        onClick={() =>
                                            this.setModalVisible(true)
                                        }
                                    >
                                        {this.state.lat
                                            ? `${this.state.lat},${this.state.lng}`
                                            : "Chưa đăng ký địa chỉ"}
                                    </Button>
                                ) : this.state.lat ? (
                                    `${this.state.lat},${this.state.lng}`
                                ) : (
                                    "Chưa đăng ký địa chỉ"
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {this.state.edit ? (
                    <div className="submit-btn d-flex justify-content-center">
                        <Space>
                            <Button onClick={() => this.onChangeEditStatus(0)}>
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
                ) : null}
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
        currentUser: state.auth.currentUser,
        loading: state.auth.loading
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
    connect(mapStateToProps, mapDispatchToProps)(Profile)
);
