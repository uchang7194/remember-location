import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalLocInfoSettings from './ModalLocInfoSettings';

export default class ModalLocInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isModified: false,
      isDeleted: false,
      markerInfo: {
        marker_name: '',
        marker_des: ''
      },
    }
  }

  _handleOnSubmit(e) {
    e.preventDefault();
  }

  _handleOnChage = (what, e) => {
    
    const copy_marker_info = Object.assign({}, this.state.markerInfo);

    copy_marker_info[what] = e.target.value;
    this.setState({
      markerInfo: copy_marker_info
    })
  }
  
  _handleOnClick = (type) => {
    const data = Object.assign({}, this.state.markerInfo);

  
    if( type === 'save' ) {
      data.isSaved = true;
      this.props.handleMarkersData(data);
    } else if( type === 'cancle' ) {
      this.props.handleToggleModal();
    }
  }

  _renderInfo() {

    if( this.state.isModified ) {
      return (
        <div>
          <div className="modify-locname-area">
            <label>장소</label>
            <input 
              type="text"
              value={this.state.markerInfo.marker_name}
              onChange={ (e) => {this._handleOnChage('marker_name', e)} }
              />
          </div>
          <div className="modify-des-area">
            <label>설명</label>
            <textarea 
              value={this.state.markerInfo.marker_des}
              onChange={ (e) => {this._handleOnChage('marker_des', e)} }
              />
          </div>
        </div>
      );
    } else {
      return (
        <span className="location_name">{this.state.markerInfo.location_name}</span>
      );
    }
  }

  _initState = () => {
    const _marker_info = Object.assign({}, this.props.markerInfo);
    let _isModified = false;

    if( !_marker_info.isSaved ) {
      console.log('저장된 marker 정보가 아닐 때');
      _isModified = true;
    }

    this.setState({
      isModified: _isModified,
      markerInfo: _marker_info
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
  markerInfo: PropTypes.object.isRequired,
  handleMarkersData: PropTypes.func.isRequired,
  handleToggleModal: PropTypes.func.isRequired
};
