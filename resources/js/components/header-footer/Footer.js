import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/footer.scss";
import Http from "../../Http";

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className="footer-section">
                <div className="triangle"></div>
                <h1>Thanks for using Latner!</h1>
                <p>duongdang0508@gmail.com</p>
            </footer>
        );
    }
}

export default Footer;
