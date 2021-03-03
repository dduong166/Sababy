import React, { Component } from "react";
import Http from "../../Http";
import "./css/DistanceComponent.scss";
import { Modal, Button, notification } from "antd";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";

class DistanceSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            visible: false,
            inited: false
        };
        this.SortByDistance = this.SortByDistance.bind(this);
        this.initMap = this.initMap.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
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
        console.log("init map nè");
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
            google.maps.event.addListener(map, "click", e => {
                console.log(e);
                var latLng = e.latLng;
                this.setState({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
                console.log(latLng.lat(), latLng.lng());
                if (marker && marker.setMap) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                map.panTo(marker.getPosition());
                input.value = "";
            });
            autocomplete.addListener("place_changed", () => {
                infowindow.close();
                const place = autocomplete.getPlace();
                console.log(place);

                if (!place.geometry || !place.geometry.location) {
                    window.alert(
                        "Không tìm thấy vị trí " +
                            place.name +
                            " .Vui lòng chọn trên bản đồ."
                    );
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
    SortByDistance() {
        this.props.setIsProductLoading(true);
        if (this.state.lat && this.state.lng) {
            this.setModalVisible(false);
            const uri = "http://localhost:8000/api/product/distance";
            const request = {
                lat: this.state.lat,
                lng: this.state.lng
            };
            Http.post(uri, request).then(response => {
                if (response) {
                    this.props.setProducts(response.data);
                    this.props.setIsProductLoading(false);
                } else {
                    console.log("Tính khoảng cách thất bại.");
                }
            });
        } else {
            notification["error"]({
                message:
                    "Hãy xác định vị trí nhận hàng bằng cách tìm kiếm địa điểm hoặc chọn trên bản đồ."
            });
        }
    }

    render() {
        console.log(this.props);
        return (
            <div className="google-place-autocomplete">
                <Button
                    type="primary"
                    onClick={() => this.setModalVisible(true)}
                >
                    Sắp xếp theo khoảng cách
                </Button>
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
                    <div id="map"></div>
                    <div id="infowindow-content">
                        <span id="place-name" className="title"></span>
                        <br />
                        <span id="place-address"></span>
                    </div>
                </Modal>
                {/* <button
                    type="button"
                    className="btn btn-primary openMapButton"
                    data-toggle="modal"
                    data-target=".bd-example-modal-lg"
                    onClick={this.initMap}
                >
                    Sắp xếp theo khoảng cách
                </button> */}

                {/* <div
                    className="modal fade bd-example-modal-lg"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="myLargeModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="exampleModalLongTitle"
                                >
                                    Xác định vị trí nhận hàng
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">aaa</div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.SortByDistance}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.SortByDistance}
                >
                    Vị trí hiện tại
                </button> */}
            </div>
        );
    }
}

export default DistanceSort;
// export default GoogleApiWrapper({
//     apiKey: "AIzaSyDL-mENJ7NamXqaEropaAeCsFC42q9lLb4"
// })(DistanceSort);
