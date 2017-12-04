import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      actived_modal_loc_info: false
    }
  
    this._initMap = this._initMap.bind(this);
    this._initSearch = this._initSearch.bind(this);
    this._moveTo = this._moveTo.bind(this);
    this._addMarker = this._addMarker.bind(this);

    this.map = null;
    this.markers = [];
    this.info_window = null;
  }
  _initMap() {
    const google = window.google;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.90775699999999, lng: 127.76692200000002
      },
      zoom: 7
    });

    // map click event
    this.map.addListener('click', function(position) {
      const lat = position.latLng.lat(),
            lng = position.latLng.lng();
      
      // 마커 추가
    });

    this._initSearch(google, this.map);
    this._initInfoWindow(google, this.map);
    // this._handleAddEvent(map, 'click', this._callbackMapTest);
  }
  _initSearch = (google, map) => {
    
    let input = this.refs.searchAddr,
        searchBox = new google.maps.places.SearchBox(input);
    
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // 1. 뷰포트의 방향대로 autoComplete를 보여주게 함.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      let places = searchBox.getPlaces();
      // 장소를 검색하면 나오는 정보들.

      if( places.length === 0 ) {
        alert(input.value + '는 찾을 수 없습니다.');
        return;
      }

      this._moveTo(places[0].geometry.location);
      input.value = '';
    });
  }
  _initInfoWindow = (google, map) => {
    
    let _info_window = new google.maps.InfoWindow();

    this.info_window = _info_window;
  }
  
  _moveTo(position) {
    this.map.panTo(position);
    this.map.setZoom(15);
    this._addMarker(position);
  }
  _clearMarkers() {
    console.log(this.markers);
    const markers = this.markers;
    let i = 0, length = markers.length;
    for( ; i < length; i++) {
      if( markers[i] ) {
        markers[i].setMap(null);
      }
    }
  }
  _addMarker(position) {
    const google_map = window.google.maps;
    let marker = new google_map.Marker({
      position: position,
      map: this.map,
      animation: google_map.Animation.DROP
    });

    this._clearMarkers();
    marker.addListener('click', () => {
      // console.log(this._info_window);
      // this.info_window.open(this.map, marker);
      this.setState({
        actived_modal_loc_info: !this.state.actived_modal_loc_info
      });
    })
    this.markers.push(marker);
    
  }
  componentDidMount() {
    this._initMap();
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   const old_pos = JSON.stringify(this.props.currentPosition);
  //   const new_pos = JSON.stringify(nextProps.currentPosition);

  //   if( old_pos === new_pos ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  
  componentDidUpdate = (prevProps, prevState) => {
    if( JSON.stringify(this.props.currentPosition) !== `{}` ) {
      this._moveTo(this.props.currentPosition);
    }
    console.log(window.innerHeight);
    // this.refs.map.style.height = window.innerHeight - 45 + 'px';
  }
  
  render() {
  
    return (
      <div className="content-map">
        <div id="map" ref="map">
          <input 
            ref="searchAddr"
            type="text"
            id="search-addr"
            placeholder="주소를 입력해주세요."></input>
        </div>
      </div>
    )
  }
}

Map.propTypes = {
  currentPosition: PropTypes.object.isRequired
}