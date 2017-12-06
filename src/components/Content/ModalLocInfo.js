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
        marker_tit: '',
        marker_des: ''
      },
    };

    this._handleModify = this._handleModify.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
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
    } else if( type === 'modify' ) {
      this.props.handleMarkersData(data, true);
    }
  }

  _renderInfo() {

    if( !this.state.isModified ) {
      return (
        <div>
          <div className="modify-locname-area">
            <label>제목</label>
            <input 
              type="text"
              value={this.state.markerInfo.marker_tit}
              onChange={ (e) => {this._handleOnChage('marker_tit', e)} }
              />
          </div>
          <div className="modify-des-area">
            <label>내용</label>
            <textarea 
              value={this.state.markerInfo.marker_des}
              onChange={ (e) => {this._handleOnChage('marker_des', e)} }
              />
          </div>
        </div>
      );
    } else {
      return (
        <div className="info-loc-details">
          <div className="details-tit">
            <p>{this.state.markerInfo.marker_tit}</p>
          </div>
          <div className="details-des">
            <p>{this.state.markerInfo.marker_des}</p>
          </div>
        </div>
      );
    }
  }

  _handleModify = () => {
    this.setState({
      isModified: !this.state.isModified
    });
  }
  _handleDelete = () => {
    const {position} = this.state.markerInfo;

    this.props.handleDeleteMarker(position);
  }

  _renderBtns = () => {
    if( !this.state.isModified ) {
      return (
        <div className="modal-info-btns">
          <button 
            type="button"
            onClick={() => {
              if( this.state.markerInfo.isSaved ) {
                console.log('수정하기');
                this._handleOnClick('modify');
              } else {
                this._handleOnClick('save');
              }
            }}
            >저장</button>
          <button 
            type="button"
            onClick={() => {this._handleOnClick('cancle')}}
            >취소</button>
        </div>
      );
    } else {
      return (
        <div className="modal-info-btns">
          <button 
            type="button"
            onClick={() => {this._handleOnClick('cancle')}}
            >확인</button>
        </div>
      );
    }
  }

  _initState = () => {
    const _marker_info = Object.assign({}, this.props.markerInfo);

    this.setState({
      isModified: _marker_info.isSaved,
      markerInfo: _marker_info
    });
  }
  componentDidMount = () => {
    this._initState();
  }
  
  componentWillReceiveProps = (nextProps) => {
    const _markerInfo = Object.assign({}, nextProps.markerInfo);
    
    console.log('ModalLocInfo _markerInfo: ', _markerInfo);
    this.setState({
      isModified: _markerInfo.isSaved,
      markerInfo: _markerInfo
    });
  }
  
  
  render() {
    return (
      <div className="modal-info">
        <div className="modal-info-inner">
          <div className="modal-info-settings">
            <button type="button">Settings</button>
            <ModalLocInfoSettings 
              handleModify={this._handleModify}
              handleDelete={this._handleDelete}
            />
          </div>
          <form 
            className="modal-info-form"
            onClick={(e) => this._handleOnSubmit(e)}>
            <fieldset>
              <legend>위치에 대한 정보 입력창</legend>
              <div className="info-loc">
                <p>{this.state.markerInfo.marker_addr}</p>
              </div>
              {this._renderInfo()}
              {this._renderBtns()}
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
  handleDeleteMarker: PropTypes.func.isRequired,
  handleToggleModal: PropTypes.func.isRequired
};
