import React, { Component } from 'react';

import Map from './Map';

export default class Content extends Component {

  constructor(props) {
    super(props);

    this.state = {
      current_coords: {},
    }

    this._handleGeoLocation = this._handleGeoLocation.bind(this);
    this._handleErrorGeoLoc = this._handleErrorGeoLoc.bind(this);
    this._handleSuccessGeoLoc = this._handleSuccessGeoLoc.bind(this);
  }
  // geolocation으로 좌표값 구하기

  _handleGeoLocation() {
    const geolocation = navigator.geolocation;

    if( geolocation ) {
      geolocation.getCurrentPosition((position) => {
        this._handleSuccessGeoLoc(position);
      }, this._handleErrorGeoLoc);
    }
  }
  _handleSuccessGeoLoc(position) {
    /*
      coords
        - latitude
        - longitude
    */ 
    let lat = position.coords.latitude,
        lng = position.coords.longitude;

    console.log('lat: ', lat);
    console.log('lng: ', lng);
    this.setState({
      current_coords: {
        lat,
        lng
      }
    });
  }
  _handleErrorGeoLoc() {
    alert('위치 권한을 허용해주세요.');
  }
  render() {
    
    return (
      <div className="content">
        <div className="content-utils-box">
          <button 
            type="button"
            onClick={() => { this._handleGeoLocation(); }}
            >위치</button>
        </div>
        <Map 
          currentPosition={this.state.current_coords}
          />
      </div>
    )
  }
}
