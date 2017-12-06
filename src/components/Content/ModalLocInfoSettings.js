import React from 'react';
import PropTypes from 'prop-types';


const ModalLocInfoSettings = (props) => {

    return (
      <div>
        <ul>
          <li>
            <button 
              type="button"
              onClick={() => {props.handleModify();}}
              >수정</button>
          </li>
          <li>
            <button 
              type="button"
              onClick={() => {props.handleDelete();}}
              >삭제</button>
          </li>
        </ul>
      </div>
    );
}

ModalLocInfoSettings.propTypes = {
  handleModify: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default ModalLocInfoSettings;