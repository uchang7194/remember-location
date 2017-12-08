import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Map from './Map';

export default class Content extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div className="content">
        <Map
          userInfo={this.props.userInfo}
          isLoggedIn={this.props.isLoggedIn}
        />
      </div>
    )
  }
}

Content.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired
}