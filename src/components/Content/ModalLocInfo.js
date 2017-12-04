import React from 'react';
import PropTypes from 'prop-types';


const ModalLocInfo = (props) => {

    function _handleOnSubmit(e) {
      e.preventDefault();
    }
    return (
      <div className="modal-loc-info">
        <form onClick={(e) => _handleOnSubmit(e)}>
          <fieldset>
            <legend>위치에 대한 정보 입력창</legend>
            <p className="location">{props.location}</p>
            
          </fieldset>
        </form>
      </div>
    );
}

ModalLocInfo.PropTypes = {
  location: PropTypes.string.isRequired
};

export default SetLocInfoModal;