import React, { Component } from "react";
import Http from "../../Http";
import "./css/DistanceComponent.scss";
import { Modal, Button, notification } from "antd";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
const queryString = require("query-string");

class DistanceSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            visible: false,
            inited: false,
            is_sort: false
        };
        this.SortByDistance = this.SortByDistance.bind(this);
        this.initMap = this.initMap.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        const condition = queryString.parse(location.search);
        if (condition.location) {
            condition.location = condition.location.split(",");
            this.setState({
                lat: condition.location[0],
                lng: condition.location[1]
            });
        }
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
            google.maps.event.addListener(
                map,
                "click",
                e => {
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
                    infowindowContent.children[
                        "place-name"
                    ].textContent = latLng;
                    infowindowContent.children["place-address"].textContent =
                        "";
                    infowindow.open(map, marker);
                }
            );
            autocomplete.addListener(
                "place_changed",
                () => {
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
                }
            );
        }
    }

    onReset() {
        this.setModalVisible(false);
        this.setState({ lat: null, lng: null, is_sort: false });
        const condition = queryString.parse(location.search);
        if (condition.location) {
            delete condition.location;
            let stringified = queryString.stringify(condition);
            if (stringified) stringified = "?" + stringified;
            this.props.history.push({
                pathname: location.pathname,
                search: stringified
            });
        }
    }

    SortByDistance() {
        if (this.state.lat && this.state.lng) {
            this.setModalVisible(false);
            this.setState({ is_sort: true });
            const condition = queryString.parse(location.search);
            condition.location = `${this.state.lat},${this.state.lng}`;
            let stringified = queryString.stringify(condition);
            if (stringified) stringified = "?" + stringified;
            this.props.history.push({
                pathname: location.pathname,
                search: stringified
            });
        } else {
            notification["error"]({
                message:
                    "Hãy xác định vị trí nhận hàng bằng cách tìm kiếm địa điểm hoặc chọn trên bản đồ."
            });
        }
    }

    render() {
        return (
            <div className="google-place-autocomplete">
                {this.state.is_sort ? (
                    <Button onClick={() => this.setModalVisible(true)} danger>
                        Khoảng cách từ ({this.state.lat},{this.state.lng})
                    </Button>
                ) : (
                    <Button onClick={() => this.setModalVisible(true)}>
                        Sắp xếp theo khoảng cách
                    </Button>
                )}

                <Modal
                    title="Xác định vị trí nhận hàng"
                    centered
                    visible={this.state.visible}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => this.setModalVisible(false)}
                        >
                            Đóng
                        </Button>,
                        <Button key="reset" onClick={this.onReset}>
                            Bỏ sắp xếp
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.SortByDistance}
                        >
                            Xác nhận
                        </Button>
                    ]}
                    onOk={() => this.SortByDistance()}
                    onCancel={() => this.setModalVisible(false)}
                    width={1000}
                >
                    <div className="pac-card" id="pac-card">
                        <div id="pac-container">
                            <input
                                id="pac-input"
                                type="text"
                                placeholder="Nhập vị trí của bạn hoặc vị trí nhận hàng"
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

export default DistanceSort;
// export default GoogleApiWrapper({
//     apiKey: "AIzaSyDL-mENJ7NamXqaEropaAeCsFC42q9lLb4"
// })(DistanceSort);
