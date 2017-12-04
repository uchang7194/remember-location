import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalLocInfo from './ModalLocInfo';

export default class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      actived_modal: false,
      clicked_marker_info: {},
      location_data: []
    }
  
    this._initMap = this._initMap.bind(this);
    this._initSearch = this._initSearch.bind(this);
    this._moveTo = this._moveTo.bind(this);
    this._addMarker = this._addMarker.bind(this);
    this._handleLocData = this._handleLocData.bind(this);
    this._handleToggleActivedModal = this._handleToggleActivedModal.bind(this);

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
      const LOC_VALUE = input.value;

      if( places.length === 0 ) {
        alert(LOC_VALUE + '는 찾을 수 없습니다.');
        return;
      }
      
      this._moveTo(places[0].geometry.location, LOC_VALUE);
      input.value = '';
    });
  }
  _initInfoWindow = (google, map) => {
    
    let _info_window = new google.maps.InfoWindow();

    this.info_window = _info_window;
  }
  
  _moveTo(position, loc_name='') {

    if( this._isContainedLocData(position) ) {
      alert('이미 저장되어있습니다.');
      return;
    }
    this.map.panTo(position);
    this.map.setZoom(15);
    this._addMarker(position, loc_name);
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
  _isContainedLocData = (position) => {
    let copy_location_data = this.state.location_data.slice(),
        _copy_position = {};

    if( this._positionValueTypeCheck(position) ) {
      _copy_position.lat = position.lat();
      _copy_position.lng = position.lng();
    }

    copy_location_data = copy_location_data.filter( data => {
      const _position = data.location_pos;
      
      if( _position.lat === _copy_position.lat && _position.lng === _copy_position.lng ) {
        return true;
      } else{
        return false;
      }
    });

    return (copy_location_data.length !== 0) ? true : false;
  }
  _positionValueTypeCheck = (position) => {

    return (typeof position.lat === 'function') ? true : false;
  }
  _addMarker(position, loc_name='', loc_des='') {
    const google_map = window.google.maps;
    let marker = new google_map.Marker({
      position: position,
      map: this.map,
      animation: google_map.Animation.DROP
    });

    // this._clearMarkers();
    marker.addListener('click', () => {
      // console.log(this._info_window);
      // this.info_window.open(this.map, marker);
      let copy_marker_info = Object.assign({}, this.state.clicked_marker_info),
          _position = {};
      
      if( loc_name !== '' && loc_des !== '' ) {
        copy_marker_info.is_modified = false;
      } else {
        copy_marker_info.is_modified = true;
      }

      copy_marker_info.location_pos = {};
      console.log( typeof position.lat );

      if( typeof position.lat === 'function' ) {
        _position.lat = (position.lat()).toFixed(12);
        _position.lng = (position.lng()).toFixed(12);
      } else {
        _position.lat = (position.lat).toFixed(12);
        _position.lng = (position.lng).toFixed(12);
      }

      copy_marker_info.location_pos = _position;
      copy_marker_info.location_name = loc_name;
      copy_marker_info.location_des = loc_des;

      this.setState({
        actived_modal: !this.state.actived_modal,
        clicked_marker_info: copy_marker_info
      });
    })
    this.markers.push(marker);
    
  }
  _handleLocData = (data) => {
    let copy_location_data = this.state.location_data.slice();

    // data: Object
    copy_location_data.push(data);

    this.setState({
      actived_modal: !this.state.actived_modal,
      location_data: copy_location_data
    });
  }
  _handleToggleActivedModal = () => {
    this.setState({
      actived_modal: !this.state.actived_modal
    });
  }
  _renderModal = () => {
    if( this.state.actived_modal ) {
      console.log('clicked_marker_info: ', this.state.clicked_marker_info);
      return (
        <ModalLocInfo 
          setLocData={this._handleLocData}
          toggleModal={this._handleToggleActivedModal}
          marker_info={this.state.clicked_marker_info}/>
      );
    }
  }
  _renderMarkers = () => {
    const location_data = this.state.location_data;
    
    if( location_data.length === 0 ) { return; }

    location_data.forEach( data => {
      
      this._addMarker(data.position, data.location_name, data.location_des);
    });
  }
  componentDidMount() {
    this._initMap();
    this._renderMarkers();
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  // }
  
  componentDidUpdate = (prevProps, prevState) => {
    if( JSON.stringify(this.props.currentPosition) !== `{}` && prevProps.currentPosition !== this.props.currentPosition ) {
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
        {this._renderModal()}
      </div>
    )
  }
}

Map.propTypes = {
  currentPosition: PropTypes.object.isRequired
}