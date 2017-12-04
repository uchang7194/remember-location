import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      
    };

    this._handleFacebookLogin = this._handleFacebookLogin.bind(this);
    this._handleFacebookLogout = this._handleFacebookLogout.bind(this);
    this._handleFacebookStatusChange = this._handleFacebookStatusChange.bind(this);
    this._handleCheckLoginStatus = this._handleCheckLoginStatus.bind(this);
  }

  _handleFacebookStatusChange = (response) => {
    console.log('status: ', response);
    let user_info = {};

    if( !this.state.is_logged_in && response.status === 'connected' ) {
      user_info.auth = response.authResponse;  
      window.FB.api('/me', {fields: 'email, name, picture'}, (response) => {

        user_info.email = response.email;
        user_info.name = response.name;
        user_info.picture = response.picture.data.url;

        this.props.setUserInfo(user_info);
      });

      this.props.clickedLog();
    } else if( response.status === 'not_authorized' ) {
      console.log('not_authorized');
    } else {
      console.log('not connected');
    }
  }
  
  _handleCheckLoginStatus = (response) => {
    window.FB.getLoginStatus((response) => {
      this._handleFacebookStatusChange(response);
    });
  }

  _handleFacebookLogin = () => {
    
    window.FB.login(this._handleCheckLoginStatus, {scope: 'public_profile,email'});
  }

  _handleFacebookLogout = () => {
    window.FB.logout((response) => {

      const user_info = {
        auth: {},
        picture: '',
        name: '',
        email: ''
      }
      this.props.clickedLog();
      this.props.setUserInfo(user_info);
    
    });
  }
  _renderedUserInfo = () => {
    let is_logged_in = this.props.isLoggedIn;

    if( is_logged_in ) {
      return (
        <a className="user-info" href="#">
          <div>
            <img src={this.props.user_info.picture} alt="유저 사진" />
          </div>
          <span>{this.props.user_info.name}</span>
        </a>  
      );
    } else {
      return '';
    }
  }
  _renderedloggedBtn = () => {
    let is_logged_in = this.props.isLoggedIn;

    if( !is_logged_in ) {
      return (
        <button 
          type="button"
          onClick={() => { this._handleFacebookLogin() }}
          >
          Facebook Login</button>
      );
    } else {
      return (
        <button 
          type="button"
          onClick={() => { this._handleFacebookLogout() }}
          >
          Logout</button>
      );
    }
  }

  componentDidMount = () => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId      : '151724048888334',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
      });
        
      // FB.AppEvents.logPageView();   
      window.FB.getLoginStatus((response) => {
        console.log(response);
        // localStorage에 token정보가 있음
        // token 정보가 사용자와 일치하는지 검사.
        this._handleFacebookStatusChange(response);
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
  

  render() {
    return (
      <header ref="header">
        <div className="header-inner">
          <div className="header-logged-box">
            {this._renderedUserInfo()}
            {this._renderedloggedBtn()}
          </div>
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  clickedLog: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}