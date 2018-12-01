import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SettingsCheckboxInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    };
  }

  render() {
    return(
      <input type="checkbox" checked={this.state.checked} onChange={this.handleChange}/>
    );
  }

  handleChange = event => {
    this.setState({
      checked: event.target.checked
    });
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