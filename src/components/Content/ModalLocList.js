import React from 'react';
import PropTypes from 'prop-types';

const ModalLocList = (props) => {

    const markersData = props.markersData;
    function isMarkersData() {
      if( markersData.length > 0 ) {
        return (
          <ul>
            {markersData.map((data, idx) => {
              return (
                <li key={idx}>
                  <a href="#" onClick={props.moveTo.bind(this, data.position)}>
                    <p>{data.marker_tit}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <div className="no-list">
            <p>No Item</p>
          </div>
        );
      }
    }
    return (
      <div className="modal-loc-list">
        <div className="loc-list-inner">
          {isMarkersData()}
          <button 
            type="button"
            onClick={() => {props.handleToggleModal()}}
            >확인</button>
        </div>
      </div>
    );
};

ModalLocList.propTypes = {
  markersData: PropTypes.array.isRequired,
  moveTo: PropTypes.func.isRequired,
  handleToggleModal: PropTypes.func.isRequired
};

export default ModalLocList;