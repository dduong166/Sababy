import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Http from '../../Http'
import $ from "jquery";
import "./css/login.css";

class Login extends Component {

    constructor(props) {
      super(props);
  
      this.onChangeUsername = this.onChangeUsername.bind(this);
      this.onChangeEmail = this.onChangeEmail.bind(this);
      this.onChangePassword = this.onChangePassword.bind(this);
      this.onSignupSubmit = this.onSignupSubmit.bind(this);
      this.onLoginSubmit = this.onLoginSubmit.bind(this);
  
      this.state = {
        username: "",
        password: "",
        email: "",
        loading: true
      };
    }

    componentDidMount() {
      function checkPasswordMatch() {
        var password = $("#new_password").val();
        var confirmPassword = $("#confirm_password").val();
        if (confirmPassword === "") $("#confirm-password-error-message").empty();
        else if (password !== confirmPassword) {
          $("#confirm-password-error-message").html(
            "Password do not match! Please enter again"
          );
          $("#signup-button").prop("disabled", true);
        } else {
          $("#confirm-password-error-message").html("Password match <3");
          $("#signup-button").prop("disabled", false);
        }
      }
  
      $(document).ready(function() {
        $("#confirm_password").keyup(checkPasswordMatch);
        $("#new_password").keyup(checkPasswordMatch);
      });
  
      $(".form")
        .find("input, textarea")
        .on("keyup blur focus", function(e) {
          var $this = $(this),
            label = $this.prev("label");
  
          if (e.type === "keyup") {
            if ($this.val() === "") {
              label.removeClass("active highlight");
            } else {
              label.addClass("active highlight");
            }
          } else if (e.type === "blur") {
            if ($this.val() === "") {
              label.removeClass("active highlight");
            } else {
              label.removeClass("highlight");
            }
          } else if (e.type === "focus") {
            if ($this.val() === "") {
              label.removeClass("highlight");
            } else if ($this.val() !== "") {
              label.addClass("highlight");
            }
          }
        });
  
      $(".tab h2").on("click", function(e) {
        e.preventDefault();
        $(this)
          .parent()
          .addClass("active");
        $(this)
          .parent()
          .siblings()
          .removeClass("active");
  
        var target = $(this).attr("name");
        console.log(target);
        $(".tab-content > div")
          .not(target)
          .hide();
  
        $(target).fadeIn(600);
      });
    }
  
    onChangeUsername(e) {
      this.setState({
        username: e.target.value
      });
    }
  
    onChangePassword(e) {
      this.setState({
        password: e.target.value
      });
    }
  
    onChangeEmail(e) {
      this.setState({
        email: e.target.value
      });
    }

    onSignupSubmit(e) {
      e.preventDefault();
      let uri = 'api/user/register';
      const newUser = {
        name: this.state.username,
        password: this.state.password,
        email: this.state.email
      };
      Http.post(uri, newUser).then((response) => {
        if (response.data.success) {
            console.log(response);
            this.props.history.push('/')
        }
      });
      this.setState({
        username: "",
        password: "",
        email: ""
      });
    }

    onLoginSubmit(e) {
      e.preventDefault();
      let uri = 'api/user/login';
      const loginUser = {
        email: this.state.email,
        password: this.state.password
      };
      console.log("login user:", loginUser);
      Http.post(uri, loginUser).then((response) => {
        if (response.data.success) {
          console.log(this.props);
          
            this.props.updateUser({
              current_user: response.data.username
            });
            this.setState({loading: false});
            console.log("Res:", response);
            localStorage.setItem('auth_token',response.data.auth_token)
            Http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.auth_token;
            if(!this.state.loading){
              this.setState({
                username: "",
                password: "",
                email: ""
              });
            }
            this.props.history.push('/')
        }
      });
    }
render() {
  return (
    <div>
      <div className="form">
        <ul className="tab-group">
          <li className="tab">
            <h2 name="#signup">
              <Link to="">Sign Up</Link>
            </h2>
          </li>
          <li className="tab active">
            <h2 name="#login">
              <Link to="">Log In</Link>
            </h2>
          </li>
        </ul>

        <div className="tab-content">
          <div id="login">
            <h1>Welcome Back!</h1>

            <form onSubmit={this.onLoginSubmit}>
              <div className="field-wrap">
                <label>
                  Email<span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                  name="username"
                />
              </div>

              <div className="field-wrap">
                <label>
                  Password<span className="req">*</span>
                </label>
                <input
                  type="password"
                  required
                  onChange={this.onChangePassword}
                  name="password"
                />
              </div>

              <p className="forgot">
                <Link to="/">Forgot Password?</Link>
              </p>

              <button
                id="login-button"
                type="submit"
                className="button button-block"
              >
                Login
              </button>
            </form>
          </div>

          <div id="signup">
            <h1>Sign Up for Free</h1>

            <form onSubmit={this.onSignupSubmit}>
              <div className="field-wrap">
                <label>
                  Username<span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                  name="username"
                  minLength="3"
                />
              </div>

              <div className="field-wrap">
                <label>
                  Email Address<span className="req">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                />
              </div>

              <div className="field-wrap">
                <label>
                  Password<span className="req">*</span>
                </label>
                <input
                  id="new_password"
                  type="password"
                  required
                  onChange={this.onChangePassword}
                  name="password"
                />
              </div>

              <div className="field-wrap">
                <label>
                  Enter your password again<span className="req">*</span>
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  required
                  autoComplete="off"
                  onChange="checkPasswordMatch();"
                />
                <div id="confirm-password-error-message"></div>
              </div>

              <button
                id="signup-button"
                type="submit"
                className="button button-block"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default Login