import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { database } from '../../firebase/';

import ModalLocInfo from './ModalLocInfo';
import ModalLocList from './ModalLocList';

export default class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activedMarkerInfoModal: false,
      activedMarkerListModal: false,
      clickedMarkerInfo: {},
      current_coords: {},
      userInfo: {},
      markersData: [],
      browser_height: 0,
      isLoading: false,
    }
    // Global values
    this.map = null;
    this.current_marker = null;
    this.infoWindow = null;
    this.COMMON_URL = '/rememberLocation/';
    this.URL = '';
    this.markers = [];
    this.markerIcons = {
      default: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/default.png?alt=media&token=485ce198-30c7-4ae1-ac5e-946eaf50ce74',
      cafe: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/cafe.png?alt=media&token=5c52b219-a917-4ef5-873b-1e00db64d750',
      park: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/park.png?alt=media&token=ca1222d0-3283-44d7-9946-3fe85a5078ef',
      shop: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/shop.png?alt=media&token=3d0ac2e6-4c9b-4fcb-b3a5-00bee7b7f126',
      company: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/company.png?alt=media&token=61c74708-de22-4b0e-a641-d2017a733cf7',
      school: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/school.png?alt=media&token=5b4a16d3-6178-4dd9-9f9e-1d376dc8bb7e',
      hospital: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/hospital.png?alt=media&token=641c91a7-ec49-4109-8ea5-422509c9a5c6',
      busStop: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/bus.png?alt=media&token=c53627dd-5123-458e-8b60-5f422736e18e',
      subway: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/subway.png?alt=media&token=abadc712-00cf-4472-a760-5e8949b18655',
      airport: 'https://firebasestorage.googleapis.com/v0/b/remember-locatio-1512108016282.appspot.com/o/airplane.png?alt=media&token=21fdd585-86a1-4b4a-b7f6-9339d38be63c'
    }
    this.markerCluster = null;
    // Bound
    this._handleToggleActivedMarkerInfoModal = this._handleToggleActivedMarkerInfoModal.bind(this);
    this._handleToggleActivedMarkerListModal = this._handleToggleActivedMarkerListModal.bind(this);
    this._handleMarkersData = this._handleMarkersData.bind(this);
    this._handleDeleteMarker = this._handleDeleteMarker.bind(this);
    this._moveTo = this._moveTo.bind(this);
  }

  
  /**
   *
   * init methods
   *
   */
  
  /**
   * @method _initMap
   * @description google 맵 초기화
   */
  _initMap = () => {
    const google = window.google;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 35.90775699999999, 
        lng: 127.76692200000002
      },
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    this.markerCluster = new window.MarkerClusterer(this.map, null,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});      
    this._initSearch(google, this.map);
    this._initInfoWindow(google, this.map);
    this._initInfoWindow();
    // this._handleAddEvent(map, 'click', this._callbackMapTest);
  }
  /**
   * @method _initSearch
   * @description google search api 설정
   */ 
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
      
      this._moveAndAddMarker(places[0].geometry.location, LOC_VALUE);
      input.value = '';
    });
  }
  _initInfoWindow = (google, map) => {
    
    this.infoWindow = new window.google.maps.InfoWindow();
  }
  /**
   * @method _handleResizeMap
   * @description 브라우저의 높이가 변경될 때 map의 height를 resize해주는 메서드
   */ 
  _handleResizeMap = () => {
    let _map = null;
    const _browser_height = window.innerHeight;

    if( _browser_height !== this.state.browser_height ) {
      _map = this.refs.map;

      _map.style.height = _browser_height + 'px';

      this.setState({
        browser_height: _browser_height
      });
    }
  }

  
  /**
   *
   * Marker methods
   *
   */
  
  /**
   * @method _moveAndAddMarker 
   * @description marker가 google map에 표시되었을 때 이동하는 메서드
   */ 
  _moveAndAddMarker = (position, marker_addr) => {

    // if( this._isContainedLocData(position) ) {
    //   alert('이미 저장되어있습니다.');
    //   return;
    // }
    const markerInfo = {
      position, 
      marker_addr
    };

    this.map.panTo(position);
    this.map.setZoom(15);
    this._addMarker(markerInfo);
  }
  /**
   * @method _moveTo 
   * @description marker가 google map에 표시되었을 때 이동하는 메서드
   */ 
  _moveTo = (position) => {
    this.map.panTo(position);
    this.map.setZoom(15);
  }
  /**
   * @method _addMarker
   * @description 마커를 추가시키는 메서드
   * @param position lat lng 키값이 들어있는 Object
   * @param marker_addr 위치 주소 String
   * @param marker_tit 제목 String
   * @param marker_des 내용 String
   * @param isSaved 저장된 마커정보인지 판별하기 위한 값 Boolean
   * @param isContainedMarkerChk 이미 포함되어있는 마커정보인지 확인 유무를 위한 값 Boolean
   */ 
  _addMarker = (_markerInfo) => {
    // position, marker_addr = '', marker_tit = '' , marker_des = '', isSaved = false, isContainedMarkerChk = true
    const google_map = window.google.maps;
    let markerInfo = {
      position: {}, 
      marker_addr: '', 
      marker_tit: '' , 
      marker_des: '', 
      marker_type: 'default',
      isSaved: false, 
      isContainedMarkerChk: true
    };

    for(const prop in _markerInfo) {
      if( markerInfo.hasOwnProperty(prop) ) {
        markerInfo[prop] = _markerInfo[prop];
      }
    }
    
    let marker = null, infoWindow = null,
        saved_infoWindow = `
        <div class="infowindow">
          <p>${markerInfo.marker_tit}</p>
          <div>
            <button class="infoWindow-btn-modify" data-index=${this.markers.length} type="button">확인</button>
          </div>
        </div>`,
        not_saved_infoWindow = `
        <div class="infowindow">
          <div>
            <button class="infoWindow-btn-add" data-index=${this.markers.length} type="button">추가</button>
          </div>
        </div>
        `;

    console.log('this._isContainedMarker(position): ', this._isContainedMarker(markerInfo.position));
    if( markerInfo.isContainedMarkerChk && this._isContainedMarker(markerInfo.position).length !== 0 ) {
      alert('이미 등록되어 있는 장소입니다.');
      return;
    }
    // 요구조건
    // 1. 마커를 판별할 수 있는 변수를 넣었으면 좋겠음.
    //  - 인덱스, location_data에서 렌더된 마커인지.
    //    - 인덱스: index
    //    - 불러온 데이터 인지 판별: isSaved

    let marker_attr = {
      position: markerInfo.position,
      map: this.map,
      index: this.markers.length,
      isSaved: markerInfo.isSaved,
      marker_addr: markerInfo.marker_addr,
      marker_tit: markerInfo.marker_tit,
      marker_des: markerInfo.marker_des,
      marker_type: markerInfo.marker_type,
      icon: this.markerIcons[markerInfo.marker_type],
      title: markerInfo.marker_tit
    };
    
    console.log('')
    marker = new google_map.Marker(marker_attr);

    // 이벤트 추가
    // this._markerOnClick(marker);

    // 마커 추가
    this.markers.push(marker);

    // infoWindow 추가
    if( markerInfo.isSaved ) {
      // 저장된 마커일 때
      infoWindow = new window.google.maps.InfoWindow({
        content: saved_infoWindow
      });
      
    } else {
      // 저장되지 않은 마커일 때
      infoWindow = new window.google.maps.InfoWindow({
        content: not_saved_infoWindow
      });
    }
  
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
    // 클러스터 추가
    this.markerCluster.addMarker(marker);
    
  }
  /**
   * @method _markerOnClick
   * @description 마커가 추가 되었을 때 이벤트를 적용시켜주는 함수
   * @memberOf _addMarker
   * @param marker 마커 객체 Object
   */ 
  _markerOnClick = (marker) => {

    if( !this.props.isLoggedIn ) {
      alert('로그인 후 사용하실 수 있습니다.');
      return;
    }

    let copy_marker_info = Object.assign({}, this.state.clickedMarkerInfo);
    const position = this._getPosition(marker.position),
          marker_addr = marker.marker_addr,
          marker_tit = marker.marker_tit,
          marker_des = marker.marker_des,
          marker_type = !!marker.marker_type ? marker.marker_type : '',
          isSaved = marker.isSaved,
          idx = marker.index;

    copy_marker_info = {
      marker_addr,
      marker_tit,
      marker_des,
      marker_type,
      position,
      isSaved,
      idx
    };
    
    console.log('marker clicked: ', copy_marker_info);
    this.setState({
      activedMarkerInfoModal: true,
      clickedMarkerInfo: copy_marker_info
    }, () => {
      this.map.panTo(position);
      this.map.setZoom(15);
    });
  }
  /**
   * @method _isLatLngFunc
   * @description 위치 정보를 가지고 있는 객체의 lat, lng이 함수인지 아닌지 판별하는 메서드
   * @memberOf _getPosition
   * @param position Object
   */ 
  _isLatLngFunc = (position) => {
    if( typeof position.lat === 'function' ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @method _getPosition
   * @description _isLatLngFunc함수로 함수인지 판별하고 맞으면 함수를 호출해 lat, lng값을 객체형태로 반환하는 메서드
   * @param position Object
   */ 
  _getPosition = (position) => {
    if( this._isLatLngFunc(position) ) {
      return {
        lat: position.lat(),
        lng: position.lng()
      };
    } else {
      return {
        lat: position.lat,
        lng: position.lng
      };
    }
  }
  /**
   * @method _isContainedMarker
   * @description 마커가 포함되어 있는지 확인하는 메서드, 위치정보를 비교해서 판별
   * @memberOf _addMarker
   * @param position
   */ 
  _isContainedMarker = (position) => {
    const compare_marker_pos = this._getPosition(position);
    let _marker = null;


    _marker = this.state.markersData.filter(data => {

      const _position = data.position;
      if( compare_marker_pos.lat === _position.lat && compare_marker_pos.lng === _position.lng ) {
        return true;
      } else {
        return false;
      }
    });

    return _marker;
  }
  /**
   * @method _clearMarkers
   * @description this.markers의 마커 객체를 setMap을 사용해서 맵에서 지우고 state의 markersData를 초기화 시켜주는 메서드
   */ 
  _clearMarkers = () => {
    const _markers = this.markers, length = _markers.length;
    let i = 0;

    for( ; i < length; i++) {
      if( _markers[i] ) {
        _markers[i].setMap(null);
      }
    }
    this.markers = [];
  }
  /**
   * @method _handleMarkersData
   * @description ModalLocInfo component에 props로 넘겨주는 메서드 / 데이터를 저장, 수정하는 역할을 함.
   * @param data 위치정보 Object
   * @param is_modified 수정할것인지 아닌지 판별하는 값 Boolean
   */
  _handleMarkersData = (data, is_modified = false) => {

    if( !window.confirm('이대로 저장하시겠습니까?') ) {
      return;
    }
    let copy_markers_data = this.state.markersData.slice();

    if( !is_modified ) {
      // data: changed data
      copy_markers_data.push(data);
    } else {
      // change 
      const _data_pos = data.position;
      copy_markers_data = copy_markers_data.map(marker => {
        const _marker_pos = marker.position;

        if( _data_pos.lat === _marker_pos.lat && _data_pos.lng === _marker_pos.lng ) {
          marker = data;
        }

        return marker;
      });
    }
    
    // change markers data
    for(let prop in data) {
      if( data.hasOwnProperty(prop) ) {
        if( prop !== `position` ) {
          this.markers[data.idx][prop] = data[prop];
        }
      }
    }


    this.setState({
      clickedMarkerInfo: data,
      markersData: copy_markers_data
    }, () => {
      
      this._renderMarkers();
      if( this.props.isLoggedIn ) {
        const _markersData = this.state.markersData.slice();

        this._setFirebaseData('markersData', _markersData);
      }
    });
  }
  
  /**
   * @method _handleDeleteMarker
   * @description ModalLocInfo component에 props로 보내는 메서드 / 마커, 마커정보를 삭제하기위해 사용
   * @param position 위치정보(lat, lng) Object
   */ 
  _handleDeleteMarker = (position) => {

    if( !window.confirm('삭제하시겠습니까?') ) {
      return;
    }

    let _markersData = this.state.markersData.slice();
    
    
    
    // 1. _renderedMarkers를 위한 isSaved 변수를 false로 바꿔줌.
    this.markers = this.markers.map(data => {
      const _lat = data.position.lat(),
            _lng = data.position.lng();

      if( position.lat === _lat && position.lng === _lng ) {
        data.isSaved = false;
      }

      return data;
    });

    // 2. markers데이터에서 현재 삭제할 데이터만 걸러서 다시 배열로 만듬.
    _markersData = _markersData.filter(data => {
      const _lat = data.position.lat,
            _lng = data.position.lng;

      if( position.lat === _lat && position.lng === _lng ) {
        return false;
      } else {
        return true;
      }

    });
    this.setState({
      activedMarkerInfoModal: false,
      markersData: _markersData
    }, () => {
      this._renderMarkers();
      if( this.props.isLoggedIn ) {
        const _markersData = this.state.markersData.slice();

        this._setFirebaseData('markersData', _markersData);
      }
    });
  }


  
  /**
   *
   * toggle methods
   *
   */
  
  /**
   * @method _handleToggleActivedMarkerInfoModal
   * @description ModalLocInfo component를 토글시켜주기 위한 메서드
   */ 
  _handleToggleActivedMarkerInfoModal = () => {
    this.setState({
      activedMarkerInfoModal: !this.state.activedMarkerInfoModal
    }, () => {
      this._renderMarkers();
    });
  }
  _handleToggleActivedMarkerListModal = () => {
    this.setState({
      activedMarkerListModal: !this.state.activedMarkerListModal
    });
  }
  
  
  /**
   *
   * Geolocation methods
   *
   */
  
  /**
   * @method _handleGeoLocation
   * @description 현재 위치 정보를 받기 위한 메서드
   */ 
  _handleGeoLocation = () => {
    const geolocation = navigator.geolocation;

    if( geolocation ) {
      geolocation.getCurrentPosition((position) => {
        this._handleSuccessGeoLoc(position);
      }, this._handleErrorGeoLoc);
    }
  }
  /**
   * @method _handleSuccessGeoLoc
   * @description _handleGeoLocation을 호출하고 성공적으로 위치가 받아졌을 때 처리하는 callback 함수
   * @param position
   */ 
  _handleSuccessGeoLoc = (position) => {
    /*
      coords
        - latitude
        - longitude
    */ 
    let lat = position.coords.latitude,
        lng = position.coords.longitude;

    this.setState({
      current_coords: {
        lat,
        lng
      }
    }, () => {
      this._moveAndAddMarker(this.state.current_coords);
    });
  }
  /**
   * @method _handleErrorGeoLoc
   * @description _handleGeoLocation을 호출하고 위치가 받아지지 않았을 때(권한 미적용) 처리하는 callback 함수
   */ 
  _handleErrorGeoLoc = () => {
    alert('위치 권한을 허용해주세요.');
  }

  
  /**
   *
   * firebase methos
   *
   */
  
  /**
   * @method _setFirebaseData
   * @description firebase의 데이터베이스에 데이터를 업데이트 시켜주는 메서드
   * @param _url api 주소 String
   * @param data markersData Array
   */  
  _setFirebaseData = (_url, data) => {
    const URL = this.URL + '/' + _url;

    database.ref(URL).set(JSON.stringify(data));
  }
  /**
   * @method _initFirebaseData
   * @description Facebook userID를 기준으로 firebase에 해당 userID가 없을 때 firebase에 api를 초기화 시켜주는 메서드
   * @param _user_info 유저정보(Facebook) Object
   * @param URL firebase url String
   * @param KEY firebase에 추가할 때 사용할 KEY값 String
   */ 
  _initFirebaseData = (_user_info, URL, KEY) => {
    const INIT_MARKER_DATA = {
      uid: _user_info.auth.userID,
      key: KEY,
      userInfo: {
        name: _user_info.name,
        email: _user_info.email
      },
      markersData: '[]'
    };
    var updates = {};
    updates[URL + '/' + KEY] = INIT_MARKER_DATA;
    
    database.ref().update(updates);
  }
  /**
   * @method _findFirebaseData
   * @description Facebook의 userID가 firebase에 있는지 확인하는 메서드
   * @param data firebase 전체 데이터 Object
   * @param _uid Facebook userID String
   * @return data[props] 해당 userID의 데이터 정보
   * @return null 해당 userID의 데이터 정보가 없을 때 반환
   */ 
  _findFirebaseData = (data, _uid) => {

    for(let prop in data) {
      if( data.hasOwnProperty(prop) ) {
        if( data[prop].uid === _uid ) {
          return data[prop];
        }
      }
    }

    return null;
  }
  /**
   * @method _fetchData
   * @description firebase에서 데이터를 가져오는 메서드
   * @param user_info Facebook 유저정보 Object
   */ 
  _fetchData = (user_info) => {
    // firebase
    const URL = '/rememberLocation',
          KEY = database.ref().child(URL).push().key;
    let checkUserData = database.ref(URL);

    checkUserData.once('value', (snapshot) => {
      // 1. 데이터를 전부 받아옴.
      // 2. 받아온 데이터에서 userId의 값을 비교
      //    - true : 해당 user의 데이터를 state에 적용시켜줌.
      //    - false : userData를 추가시켜줌.
      const _snapshot = snapshot.val(),
            _existData = this._findFirebaseData(_snapshot, user_info.auth.userID);
      if( _existData === null ) {
        this.URL = this.COMMON_URL + KEY;
        this._initFirebaseData(user_info, URL, KEY);
        this.setState({
          isLoading: !this.state.isLoading
        });
      } else {
        this.setState({
          isLoading: !this.state.isLoading,
          markersData: JSON.parse(_existData.markersData)
        }, () => {
          this.URL = this.COMMON_URL + _existData.key;
          
          this.state.markersData.forEach(data => {
            this._addMarker({
              position: data.position, 
              marker_addr: data.marker_addr, 
              marker_tit: data.marker_tit, 
              marker_des: data.marker_des,
              marker_type: data.marker_type ? data.marker_type : 'default',
              isSaved: data.isSaved, 
              isContainedMarkerChk: false});
          });
          
          this.markerCluster.addMarkers(this.markers);
        });
      }
    });
  }
  
  
  /**
   *
   * render methods
   *
   */
  

   /**
   * @method _renderMarkers
   * @description 마커의 isSaved 정보를 기준으로 true면 google map에 표시되게 하고 false면 this.markers와 this.state.markersData에서 지워주는 메서드
   */ 
  _renderMarkers = () => {
    let new_markers = [];

    if( this.markers.length === 0 ) { return; }

    // this._clearMarkers();

    // 삭제 할 데이터 수집 및 map에서 지워줌.
    this.markers.forEach( marker => {
      
      marker.setMap(null);
      if( marker.isSaved ) {
        new_markers.push(marker);
      }
    });

    this.markers = [];

    new_markers.forEach( marker => {
      let markerInfo = {
        position: marker.position, 
        marker_addr: marker.marker_addr, 
        marker_tit: marker.marker_tit , 
        marker_des: marker.marker_des,
        marker_type: marker.marker_type,
        isSaved: marker.isSaved, 
        isContainedMarkerChk: false
      };

      this._addMarker(markerInfo);
    });

    // this.markerCluster = null;
    this.markerCluster.clearMarkers();
    this.markerCluster.addMarkers(this.markers);
  }

  /**
   * @method _renderModal
   * @description ModalLocInfo component를 렌더해주는 메서드
   */ 
  _renderModal = () => {
    if( this.state.activedMarkerInfoModal ) {
      return (
        <ModalLocInfo 
          handleMarkersData={this._handleMarkersData}
          handleDeleteMarker={this._handleDeleteMarker}
          handleToggleModal={this._handleToggleActivedMarkerInfoModal}
          markerInfo={this.state.clickedMarkerInfo}
          />
      );
    } else if ( this.state.activedMarkerListModal ) {
      return (
        <ModalLocList 
          markersData={this.state.markersData}
          handleToggleModal={this._handleToggleActivedMarkerListModal}
          moveTo={this._moveTo}
        />
      );
    }
  }
   
  /**
   * @method _renderLoading
   * @description 데이터가 불러오는 동안 Content에 표시될 영역을 렌더링하는 메서드
   */ 
  _renderLoading = () => {
    if( this.state.isLoading ) {
      return (
        <div className="content-loading">
          Loading...
        </div>   
      );
    }
  }
  
  /**
   *
   * LifeCycle
   *
   */
  
  
  componentWillReceiveProps = (nextProps) => {
    // this._initFirebaseData(nextProps);
    const user_info = nextProps.userInfo;

    if( nextProps.isLoggedIn && JSON.stringify(user_info) !== '{}' ) {
      this.setState({
        isLoading: !this.state.isLoading
      }, () => {
        this._fetchData(user_info);
      });
    } else {
      const _markersData = [];

      this.setState({
        markersData: _markersData
      }, () => {
        this._clearMarkers();
        this.markerCluster.clearMarkers();
        this.map.panTo({
          lat: 35.90775699999999, 
          lng: 127.76692200000002
        });
        this.map.setZoom(7);
      });
    }
  }
  _bind = () => {
    // resize map
    window.addEventListener('resize', this._handleResizeMap);

    // infoWindow btn event
    this.refs.map.addEventListener('click', (e) => {
      const TARGET = e.target,
            CLASS_NAME = TARGET.className;
      
      if( CLASS_NAME === 'infoWindow-btn-modify' || CLASS_NAME === 'infoWindow-btn-add' ) {
        const TARGET_INDEX = TARGET.getAttribute('data-index');
        
        this._markerOnClick(this.markers[TARGET_INDEX]);
      } 
    });
  }
  componentDidMount() {
    this._initMap();
    this._handleResizeMap();
    this._bind();
  }
  render() {
  
    return (
      <div className="content-map">
        <div>
          <div id="map" ref="map">
            <input 
              ref="searchAddr"
              type="text"
              id="search-addr"
              placeholder="주소를 입력해주세요."></input>
          </div>
          <div className="content-utils-box">
            <button 
              type="button"
              className="list-btn"
              onClick={() => { this._handleToggleActivedMarkerListModal() }}
              ><i className="material-icons">&#xE896;</i></button>
            <button 
              type="button"
              onClick={() => { this._handleGeoLocation(); }}
              ><i className="material-icons">&#xE8B4;</i></button>
          </div>
          {this._renderModal()}
        </div>
        {this._renderLoading()}
      </div>
    )
  }
}

Map.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired
}