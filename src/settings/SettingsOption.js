import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SettingsOption.css';

class SettingsOption extends Component {
  render() {
    return(
      <div className="settings-option" data-valid={this.props.valid}>
        {this.props.children}
      </div>
    );
  }
}

SettingsOption.propTypes = {
  valid: PropTypes.bool
};

SettingsOption.defaultProps = {
  valid: true
};

export default SettingsOption;