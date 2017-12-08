import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ModalLocInfoSettings extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      activedSettings: false
    }
  }

  _handleOnClick = () => {
    this.setState({
      activedSettings: !this.state.activedSettings
    });
  }
  render() {
    return (
      <div className="modal-info-settings">
        <button 
          type="button" 
          className="toggle-btn"
          onClick={() => { this._handleOnClick(); }}
          >Settings</button>
        <div className={!this.state.activedSettings ? 'setting-btns' : 'setting-btns active' }>
          <ul>
            <li>
              <button 
                type="button"
                onClick={() => {this.props.handleModify();}}
                >수정</button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => {this.props.handleDelete();}}
                >삭제</button>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}


ModalLocInfoSettings.propTypes = {
  handleModify: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}