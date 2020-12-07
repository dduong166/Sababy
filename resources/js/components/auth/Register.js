import React, {Component} from "react";
import { Link } from "react-router-dom";
import Http from "../../Http"

class Register extends Component {

    constructor (props) {
      super(props)
      this.state = {
        name: '',
        email: '',
        password: '',
        confirm_password: ''

      }
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName (e) {
      this.setState({name: e.target.value});
    }

    handleChangeEmail(e) {
      this.setState({email: e.target.value});
    }

    handleChangePassword(e) {
      this.setState({password: e.target.value});
    }

    handleChangeConfirmPassword(e) {
      this.setState({ confirm_password: e.target.value });
    }

    handleSubmit (e) {
      e.preventDefault()
      if (this.state.password == this.state.confirm_password){
        let uri = 'api/user/register'
        let userData = {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password
        }
        Http.post(uri, userData).then((response) => {
          if (response.data.success) {
            alert("Register Success")
            this.props.history.push('/')
          } else {
            alert(response.data.success)
            console.log("Dang ki loi")
          }
        });
      } else {
        alert("Password not matched")
      }

    }

  render() {
    return (
        <form id="register-form" onSubmit={this.handleSubmit} method="post">
          <h3 style={{ padding: 15 }}>Let's become a member.</h3>
          <p name="name" style={styles.label} className="center-block">Name<span style={styles.asterisk}>*</span></p>
          <input  style={styles.input} onChange={this.handleChangeName} id="name-input" name="name" type="text" className="center-block" placeholder="Name" />
          <p name="email" style={styles.label} className="center-block">Email<span style={styles.asterisk}>*</span></p>
          <input  style={styles.input} onChange={this.handleChangeEmail} id="email-input" name="email" type="email" className="center-block" placeholder="Email" />
          <p name="password" style={styles.label} className="center-block">Password<span style={styles.asterisk}>*</span></p>
          <input  style={styles.input} onChange={this.handleChangePassword} id="password-input" name="password" type="password" className="center-block" placeholder="Password" />
          <p name="confirm-password" style={styles.label} className="center-block">Confirm password<span style={styles.asterisk}>*</span>{this.state.password !== this.state.confirm_password ? (<span style={styles.asterisk}> Password not matched</span>) : (<span>ok</span>)}</p>
          <input  style={styles.input} onChange={this.handleChangeConfirmPassword} id="confirm-password-input" name="confirm-password" type="password" className="center-block" placeholder="Confirm password" />          
          <button type="submit" style={styles.button} className="landing-page-btn center-block text-center" id="email-login-btn" href="#facebook" >
            Register
          </button>
        </form>
    );
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
export default Register;