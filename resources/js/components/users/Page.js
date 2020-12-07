import React, {Component} from 'react';
import Http from '../../Http'
import { Link } from "react-router-dom";

class Page extends Component {

    constructor(props){
        super(props)
        this.state = {userName: '', isLoggedIn: false}
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        if(localStorage['auth_token']){
            this.getProfile();
        } 
    }

    getProfile() {
        Http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage['auth_token'];
        Http.get('api/user').then((response) => {
          if (response.data.name) {
            this.setState({ userName: response.data.name, isLoggedIn: true})
          }
        }).catch((error) => {
          console.log(error.response.status)
        })
    }

    logout () {
         this.setState({isLoggedIn: false, userName: ''})
         localStorage.removeItem('auth_token');
    }

    user () {
        return (
            <>
             <h1> Welcome { this.state.userName}</h1>
              <button onClick={this.logout}>Log out</button>
            </>
        )
    }

    guest () {
        return (
                <h2>Please <span><Link to='/login'>Login</Link></span></h2>
        )
    }

    render() {
        return (
            <>
                {this.state.isLoggedIn ? this.user() : this.guest() }
            </>
        )
    }
}
export default Page