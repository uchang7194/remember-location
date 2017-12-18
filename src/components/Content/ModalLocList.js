import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ModalLocList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectType: 'all'
    };

    this.markerTypes = [
      'all',
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
  }

  _handleOnChange = (e) => {
    this.setState({
      selectType: e.target.value
    });
  }
  _renderSelectOpt = () => {

    return this.markerTypes.map((data, idx) => {
      return (
        <option  
          key={idx} 
          value={data}>
          {data}
        </option>
      );
    });
  }
  _isMarkersData = () => {

    const selectType = this.state.selectType;

    if( this.props.markersData.length > 0 ) {
      let new_markersData = this.props.markersData.map((data, idx) => {
            return (
              <li key={idx} className={`type ${data.marker_type}`}>
                <a href="#" onClick={this.props.moveTo.bind(this, data.position)}>
                  <p>{data.marker_tit}</p>
                </a>
              </li>
            );
          }).filter(data => {
            return selectType === 'all' || data.props.className.indexOf(selectType) > -1 ? true : false;       
          });
      
      return (
        <ul>
          { new_markersData.length !== 0 ? new_markersData : '데이터가 없습니다.' }
        </ul>
      );
    } else {
      return (
        <div className="no-list">
          <p>마커 데이터가 없습니다.</p>
        </div>
      );
    }
  }
  render() {
    return (
      <div className="modal-loc-list">
        <div className="loc-list-inner">
          <select onChange={(e) => { this._handleOnChange(e) }}>
            { this._renderSelectOpt() }
          </select>
          <div>
            {this._isMarkersData()}
          </div>
          <button 
            type="button"
            onClick={() => {this.props.handleToggleModal()}}
            >확인</button>
        </div>
      </div>
    )
  }
}

ModalLocList.propTypes = {
  markersData: PropTypes.array.isRequired,
  moveTo: PropTypes.func.isRequired,
  handleToggleModal: PropTypes.func.isRequired
};