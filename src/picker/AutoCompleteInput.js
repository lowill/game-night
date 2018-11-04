import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './AutoCompleteInput.css';

class AutoCompleteInput extends Component {

  render() {
    return(<input type="text" className="autocompleteinput" value={this.props.value} ref={this.initInput} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}/>);
  }

  initInput = input => {
    this.input = input;
  }

  clear = () => {
    const value = this.input.value;
    this.input.value = "";
    return value;
  }

  handleChange = event => {
    this.props.onChange(event);
  }

  handleBlur = event => {
    this.props.focusChanged(event, false);
  }

  handleFocus = event => {
    this.props.focusChanged(event, true);
  }
}

AutoCompleteInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  focusChanged: PropTypes.func
};

export default AutoCompleteInput;