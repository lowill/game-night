import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autocomplete from 'js-autocomplete';

class AutoCompleteInput extends Component {

  render() {
    return(<input type="text" className="autocompleteinput" ref={this.initInput}/>);
  }

  initInput = input => {
    this.input = input;

    this.autoComplete = new autocomplete({
      selector: input,
      minChars: this.props.minChars,
      menuClass: 'ac-input-choices',
      source: this.props.sourceFn,
      onSelect: this.props.onSelect
    });
  }

  clear = () => {
    const value = this.input.value;
    this.input.value = "";
    return value;
  }
}

AutoCompleteInput.propTypes = {
  minChars: PropTypes.number,
  sourceFn: PropTypes.func,
  onSelect: PropTypes.func
};

AutoCompleteInput.defaultProps = {
  minChars: 3
};

export default AutoCompleteInput;