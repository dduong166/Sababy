import React, { Component } from "react";
import Http from "../../Http";
import { Link } from "react-router-dom";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

class DistanceSort extends Component {
    constructor(props) {
        super(props);
        this.SortByDistance = this.SortByDistance.bind(this);
    }
    SortByDistance(e) {
        // if (navigator && navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(pos => {
        //         const currentPosition = {
        //             lat: pos.coords.latitude,
        //             lng: pos.coords.longitude
        //         };
        //         console.log(currentPosition);
        //         const { google } = this.props;
        //         const origins = [currentPosition];
        //         const destinations = this.props.products.map((product, index) => {
        //             return product.location;
        //         })
        //         const travelMode = "DRIVING";
        //         var service = new google.maps.DistanceMatrixService();
        //         service.getDistanceMatrix(
        //             { origins, destinations, travelMode },
        //             (res, status) => {
        //                 console.log(res);
        //             }
        //         );
        //     });
        // } else {
        //     console.log("Fail to get current location");
        // }
        let uri = "http://localhost:8000/api/product/distance";
        let request = {
            origins: "Đại học Bách Khoa Hà Nội"
        }
        Http.post(uri, request).then(response => {
            if (response) {
                this.props.setProducts(response.data);
            }else{
                console.log("vllllllllll");
            }
        });
    }

    render() {
        return (
            <div className="product-card col-md-4">
                <button onClick={this.SortByDistance}>Sort by distance</button>
            </div>
        );
    }
}


export default GoogleApiWrapper({
    apiKey: "AIzaSyDL-mENJ7NamXqaEropaAeCsFC42q9lLb4"
})(DistanceSort);
