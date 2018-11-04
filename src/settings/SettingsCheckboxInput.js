import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SettingsCheckboxInput extends Component {

  render() {
    return(
      <input type="checkbox" checked={this.props.checked} onChange={this.handleChange}/>
    );
  }

  handleChange = event => {
    this.props.onChange(event);
  }

}

SettingsCheckboxInput.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func
}

SettingsCheckboxInput.defaultProps = {
  onChange: () => {}
}

export default SettingsCheckboxInput;