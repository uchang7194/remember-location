import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalLocInfoSettings from './ModalLocInfoSettings';

export default class ModalLocInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      is_modified: false,
      is_deleted: false,
      marker_info: {
        location_name: '',
        location_des: ''
      },
    }
  }

  _handleOnSubmit(e) {
    e.preventDefault();
  }

  _handleOnChage = (what, e) => {
    
    const copy_marker_info = Object.assign({}, this.state.marker_info);

    copy_marker_info[what] = e.target.value;
    this.setState({
      marker_info: copy_marker_info
    })
  }
  
  _handleOnClick = (type) => {
    const data = Object.assign({}, this.state.marker_info);

    if( type === 'save' ) {
      this.props.setLocData(data);
    } else if( type === 'cancle' ) {
      this.props.toggleModal();
    }
  }

  _handleWhatInput = (what) => {

    switch(what) {
      case 'locname': 
        return 'location_name';
      default:
        return 'nothing';
    }
  }

  _renderInfo() {

    const marker_info = this.props.marker_info;

    if( this.state.is_modified ) {
      return (
        <div>
          <div className="modify-locname-area">
            <label>장소</label>
            <input 
              type="text"
              value={this.state.marker_info.location_name}
              onChange={ (e) => {this._handleOnChage('location_name', e)} }
              />
          </div>
          <div className="modify-des-area">
            <label>설명</label>
            <textarea 
              value={this.state.marker_info.location_des}
              onChange={ (e) => {this._handleOnChage('location_des', e)} }
              />
          </div>
        </div>
      );
    } else {
      return (
        <span className="location_name">{this.state.marker_info.location_name}</span>
      );
    }
  }

  _initState = () => {
    const props_marker_info = Object.assign({}, this.props.marker_info);
    let copy_marker_info = Object.assign({}, this.state.marker_info),
        is_modified = false;

    if( props_marker_info.is_modified ) {
      console.log('marker_info가 빈 객체일 때');
      is_modified = true;
    }

    copy_marker_info = props_marker_info

    this.setState({
      is_modified,
      marker_info: copy_marker_info
    });
  }
  componentDidMount = () => {
    this._initState();
  }
  
  
  render() {
    return (
      <div className="modal-info">
        <div className="modal-info-inner">
          <div className="modal-info-settings">
            <button type="button">Settings</button>
            <ModalLocInfoSettings />
          </div>
          <form 
            className="modal-info-form"
            onClick={(e) => this._handleOnSubmit(e)}>
            <fieldset>
              <legend>위치에 대한 정보 입력창</legend>
              {this._renderInfo()}
              <div className="modal-info-btns">
                <button 
                  type="button"
                  onClick={() => {this._handleOnClick('save')}}
                  >저장</button>
                <button 
                  type="button"
                  onClick={() => {this._handleOnClick('cancle')}}
                  >취소</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
}

ModalLocInfo.propTypes = {
  marker_info: PropTypes.object.isRequired,
  setLocData: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};
