import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ModalLogin extends Component {

  constructor(props) {
    super(props);
  }
  
  _handleOnClickModal = (e) => {
    var target = e.target;

    if( target === this.refs.modalLogin ) {
      this.props.handleClickedLoginBtn();
    }
  }

  render() {

    if( !this.props.activeModalLogin ) {
      return '';
    }

    return (
      <div 
        ref="modalLogin"
        className="modal-login"
        onClick={(e) => {this._handleOnClickModal(e)}}
        >
        <div>
          <h3>Login</h3>
          {/* facebook login button */}
          {/* <FacebookLogin
            appId="151724048888334"
            autoLoad={true}
            fields="name,email,picture"
            callback={this.props.handleFacebookLogin}
            cssClass="facebook"
            icon="fa-facebook"
          /> */}
          <button 
            type="button" 
            className="facebook"
            onClick={() => {this.props.handleFacebookLogin()}}
            > facebook 로그인 </button>
        </div>
      </div>
    )
  }
}

ModalLogin.propTypes ={
  activeModalLogin: PropTypes.bool.isRequired,
  handleClickedLoginBtn: PropTypes.func.isRequired,
  handleFacebookLogin: PropTypes.func.isRequired
}