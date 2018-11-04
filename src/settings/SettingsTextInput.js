import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SettingsTextInput.css';

class SettingsTextInput extends Component {
  render() {
    return(
      <input className="settings-text-input" value={this.props.value} type="text" onChange={this.handleChange}/>
    );
  }

  handleChange = event => {
    this.props.onChange(event);
  }
}

SettingsTextInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
}

SettingsTextInput.defaultProps = {
  onChange: () => {}
}

export default SettingsTextInput;