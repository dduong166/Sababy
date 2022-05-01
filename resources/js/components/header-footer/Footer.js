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
                <div className="footer-text d-flex justify-content-around align-items-center">
                    <div className="thanks">
                        message hereeeeeee
                        <br />
                        message hereeeeeee
                        <br />
                        message hereeeeeee
                        <br />
                    </div>
                    <div className="contact">
                        content hereeeeeeeeeeee
                        <br />
                        Contact heareeeeeee: xxxxxxxx@gmail.com
                        <br />
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
