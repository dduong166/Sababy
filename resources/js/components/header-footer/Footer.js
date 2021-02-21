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
                        Cảm ơn vì đã sử dụng Sababy.
                        <br />
                        Mong rằng Sababy có thể mang đến sự chăm sóc tận tình
                        nhất cho bé yêu của gia đình bạn.
                        <br />
                        Đừng ngần ngại tìm kiếm những món đồ mình cần trên
                        Sababy, và đăng bán những đồ mình không còn dùng nữa.
                        <br />
                    </div>
                    <div className="contact">
                        Bạn sẽ luôn được hỗ trợ chu đáo.
                        <br />
                        Nếu cần thì liên hệ mình nhé: duongdang0508@gmail.com
                        <br />
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
