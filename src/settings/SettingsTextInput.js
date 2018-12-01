import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SettingsTextInput.css';

class SettingsTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }
  render() {
    return(
      <input className="settings-text-input" value={this.state.value} type="text" onChange={this.handleChange}/>
    );
  }

  handleChange = event => {
    this.setState({
      value: event.target.value
    });
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