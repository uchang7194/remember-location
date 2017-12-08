import React, { Component } from 'react';
import { database, storage, auth } from '../firebase/';

import Header from './Header/Header';
import Content from './Content/';

import '../css/stylesheets.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      is_logged_in: false,
      user_info: {}
    }
    this._handleClickedLog = this._handleClickedLog.bind(this);
    this._handleUserInfo = this._handleUserInfo.bind(this);
  }

  _handleClickedLog() {
    console.log('logged in');
    this.setState({
      is_logged_in: !this.state.is_logged_in
    });
  }
  _handleUserInfo(_user_info) {
    this.setState({
      user_info: _user_info
    })
  }

  render() {
    return (
      <div className="App">
        <Header 
          clickedLog={this._handleClickedLog}
          setUserInfo={this._handleUserInfo}
          
        />
        <Content 
          isLoggedIn={this.state.is_logged_in}
          userInfo={this.state.user_info}
          />
      </div>
    );
  }
}

export default App;
