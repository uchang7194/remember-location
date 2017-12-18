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

    this.markerTypes = [
      'default',
      'cafe',
      'park',
      'shop',
      'company',
      'school',
      'hospital',
      'busStop',
      'subway',
      'airport'
    ];
    this._handleModify = this._handleModify.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleOnSubmit(e) {
    e.preventDefault();
  }

  _handleOnChage = (what, e) => {
    
    const copy_marker_info = Object.assign({}, this.state.markerInfo);
    let value = e.target.value;


    copy_marker_info[what] = value;
    console.log('_handleOnChange: ', copy_marker_info);
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
      if( this.state.markerInfo.isSaved ) {
        this.setState({
          isModified: true
        });
      } else {
        this.props.handleToggleModal();
      }
    } else if ( type === 'confirm' ) {
      this.props.handleToggleModal();
    } else if( type === 'modify' ) {
      this.props.handleMarkersData(data, true);
    }
  }

  _handleOnSelect = (e) => {
    console.log(e.target.value);
  }

  _renderDescription = () => {
    return this.state.markerInfo.marker_des.split('\n').map( (data, index) => {
      return (
        <p key={index}>{data}</p>
      );
    });
  }

  _renderInfo() {

    if( !this.state.isModified ) {
      return (
        <div className="modify-loc-details">
          {/* marker_type */}
          <div className="modify-type-area">
            <select onChange={(e) => { this._handleOnChage('marker_type', e) }} defaultValue={this.state.markerInfo.marker_type}>
              {this.markerTypes.map((data, index) => {
                return(
                  <option key={index} value={data}>{data}</option>
                );
              })}
            </select>
          </div>
          <div className="modify-tit-area">
            <label>
              <input 
                type="text"
                placeholder="제목을 입력해주세요."
                value={this.state.markerInfo.marker_tit}
                onChange={ (e) => {this._handleOnChage('marker_tit', e)} }
                />
            </label>
          </div>
          <div className="modify-des-area">
            <textarea 
              placeholder="내용을 입력해주세요."
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
            <p><span>제목:</span> {this.state.markerInfo.marker_tit}</p>
          </div>
          <div className="details-des">
            <span>내용:</span>
            <div>
              {this._renderDescription()}
            </div>
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
            className="modify" 
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
            className="cancle"
            onClick={() => {this._handleOnClick('cancle')}}
            >취소</button>
        </div>
      );
    } else {
      return (
        <div className="modal-info-btns">
          <button
            className="submit" 
            type="button"
            onClick={() => {this._handleOnClick('confirm')}}
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
    const _marker_info = Object.assign({}, nextProps.markerInfo);
    
    this.setState({
      isModified: _marker_info.isSaved,
      markerInfo: _marker_info
    });
  }
  
  
  render() {
    
    return (
      <div className="modal-info">
        <div className="modal-info-inner">
          { this.state.isModified ?
            <ModalLocInfoSettings 
              handleModify={this._handleModify}
              handleDelete={this._handleDelete}
            /> : ''}
          <form 
            className="modal-info-form"
            onClick={(e) => this._handleOnSubmit(e)}>
            <fieldset>
              <legend>위치에 대한 정보 입력창</legend>
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
