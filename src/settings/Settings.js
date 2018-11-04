import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Settings.css';

class Settings extends Component {

  render() {
    return(
      <div className="settings" onClick={this.handleClick}>
        {this.props.children}
        <div className="settings-errors-view" data-show={!this.props.valid}>Error: Please enter valid values in the highlighted fields.</div>
      </div>
    );
  }

  handleClick = event => {
    event.stopPropagation();
  }
}

Settings.propTypes = {
  valid: PropTypes.bool
};

Settings.defaultProps = {
  valid: true
};

export default Settings;