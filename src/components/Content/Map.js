import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalLocInfo from './ModalLocInfo';

export default class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activedModal: false,
      clickedMarkerInfo: {},
      markersData: [],
      markers: []
    }
    // Global values
    this.map = null;
    this.current_marker = null;
    this.info_window = null;

    // Bound
    this._handleToggleActivedModal = this._handleToggleActivedModal.bind(this);
    this._handleMarkersData = this._handleMarkersData.bind(this);
  }
  _initMap = () => {
    const google = window.google;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.90775699999999, lng: 127.76692200000002
      },
      zoom: 7
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
  
  _moveTo = (position, marker_name) => {

    // if( this._isContainedLocData(position) ) {
    //   alert('이미 저장되어있습니다.');
    //   return;
    // }
    this.map.panTo(position);
    this.map.setZoom(15);
    this._addMarker(position, marker_name);
  }
  _addMarker = (position, marker_name = '', marker_des = '', isSaved = false) => {
    const google_map = window.google.maps;
    let copy_marker = this.state.markers.slice();
    let marker = null;

    // 요구조건
    // 1. 마커를 판별할 수 있는 변수를 넣었으면 좋겠음.
    //  - 인덱스, location_data에서 렌더된 마커인지.
    //    - 인덱스: index
    //    - 불러온 데이터 인지 판별: isSaved

    marker = new google_map.Marker({
      position: position,
      map: this.map,
      index: this.state.markers.length,
      isSaved,
      marker_name,
      marker_des
    });

    // 이벤트 추가
    this._markerOnClick(marker);

    // 마커 추가
    copy_marker.push(marker);
    this.setState({
      markers: copy_marker
    });
  }
  _markerOnClick = (marker) => {
    marker.addListener('click', () => {
      let copy_marker_info = Object.assign({}, this.state.clickedMarkerInfo);
      const position = {
              lat: marker.position.lat(),
              lng: marker.position.lng()
            },
            marker_name = marker.marker_name,
            marker_des = marker.marker_des,
            isSaved = marker.isSaved,
            idx = marker.index;

      copy_marker_info = {
        marker_name,
        marker_des,
        position,
        isSaved,
        idx
      };

      this.setState({
        activedModal: true,
        clickedMarkerInfo: copy_marker_info
      });
    });
  }
  _clearMarkers = () => {
    const _markers = this.state.markers,
          length = _markers.length;
    let i = 0;

    for( ; i < length; i++) {
      if( _markers[i] ) {
        _markers[i].setMap(null);
      }
    }

    this.setState({
      markers: []
    })
  }
  
  _handleMarkersData = (data) => {
    let copy_markers_data = this.state.markersData.slice();
    let _markers = this.state.markers.slice();

    // data: Object
    copy_markers_data.push(data);
    _markers[_markers.length-1].isSaved = true;
    this.setState({
      activedModal: !this.state.activedModal,
      markersData: copy_markers_data,
      markers: _markers
    }, () => {
      this._renderMarkers();
    });
  }
  _handleToggleActivedModal = () => {
    this.setState({
      activedModal: !this.state.activedModal
    }, () => {
      this._renderMarkers();
    });
  }
  _renderModal = () => {
    if( this.state.activedModal ) {
      return (
        <ModalLocInfo 
          handleMarkersData={this._handleMarkersData}
          handleToggleModal={this._handleToggleActivedModal}
          markerInfo={this.state.clickedMarkerInfo}/>
      );
    }
  }
  _renderMarkers = () => {
    const _markers = this.state.markers.slice();
    let delete_data = [];

    console.log('prev _markers: ', _markers);

    if( _markers.length === 0 ) { return; }

    // this._clearMarkers();

    _markers.forEach( (data, index) => {
      
      if( !data.isSaved ) {
        data.setMap(null);
        delete_data.push(index);
      }
    });

    delete_data.forEach( data => {
      _markers.splice(data, 1);
    });

    console.log('next _markers: ', _markers);
    if( this.state.markers.length !== _markers.length ) {
      this.setState({
        markers: _markers
      })
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    console.log('componentDidUpdate');
    
  }
  
  componentWillUpdate = (nextProps, nextState) => {
    console.log('componentWillUpdate');
    
    // if( this.state.markersData.length !== nextState.markersData.length ) {
    //   console.log('prev: ', this.state.markersData.length);
    //   console.log('next: ', nextState.markersData.length);
    //   this._renderMarkers();
    // }
      
  }
  componentDidMount() {
    this._initMap();
    
  }
  
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