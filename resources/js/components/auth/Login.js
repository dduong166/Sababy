import React, {Component} from 'react';
import axios from 'axios';
import Http from '../../Http'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail(e) {
        this.setState({email: e.target.value});
    }

    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let uri = 'api/user/login';
        Http.post(uri, this.state).then((response) => {
            if (response.data.success) {
                console.log(response);
                localStorage.setItem('auth_token',response.data.auth_token)
                Http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.auth_token;
                this.props.history.push('/')
            }
        })
    }

    render() {

        return (
            <form id="register-form" onSubmit={this.handleSubmit} method="post">
                  <h3 style={{ padding: 15 }}>Welcome Back </h3>
                  <p name="email" style={styles.label} className="center-block">Email<span style={styles.asterisk}>*</span></p>
                  <input  style={styles.input} onChange={this.handleChangeEmail} id="email-input" name="email" type="email" className="center-block" placeholder="Email" />
                  <p name="password" style={styles.label} className="center-block">Password<span style={styles.asterisk}>*</span></p>
                  <input  style={styles.input} onChange={this.handleChangePassword} id="password-input" name="password" type="password" className="center-block" placeholder="Password" />    
                  <button onClick={this.handleSubmit} style={styles.button} className="landing-page-btn center-block text-center" id="email-login-btn" href="#facebook" >
                    Login
                  </button>
            </form>
        )
    }
}

const styles = {
  asterisk: {
    color: '#FF5733',
  },
  input: {
    backgroundColor: "white",
    border: "1px solid #cccccc",
    padding: 15,
    marginBottom: 15,
    float: "left",
    clear: "right",
    width: "100%",
  },
  label: {
    float: "left",
  },
  button: {
    height: 44,
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
    border: "none",
    backgroundColor: "green",
    float: "left",
    clear: "both",
    width: "100%",
    color: "white",
    padding: 15
  },
  link: {
    width: "80%",
    float: "left",
    clear: "both",
    textAlign: "center"
  }
};
export default Login