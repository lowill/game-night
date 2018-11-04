import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fuzz from 'fuzzball';
import AutoCompleteInput from './AutoCompleteInput';
import AutoCompleteSuggestions from './AutoCompleteSuggestions';
import Utils from '../utils/Utils.js';

class AutoComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      suggestions: [],
      inputFocused: false
    };
  }

  render() {
    return(
      <div className="autocomplete" onKeyDown={this.handleKeyDown}>
        <AutoCompleteInput value={this.state.inputText} onChange={this.handleInputChange} focusChanged={this.handleInputFocus}/>
        <AutoCompleteSuggestions suggestions={this.state.suggestions} hasFocus={this.state.inputFocused} onSelect={this.handleSelect} ref={this.initSuggestions}/>
      </div>
    ); 
  }

  initSuggestions = el => {
    this.suggestions = el;
  }

  handleInputChange = event => {
    const text = event.target.value;

    const fuzzballOptions = {
      scorer: fuzz.partial_ratio,
      cutoff: 75,
      limit: this.props.maxSuggestionCount
    };

    const suggestions = fuzz
      .extract(text, this.props.choices, fuzzballOptions)
      .map(suggestion => suggestion[0])

    if(!suggestions.includes(text)) {
      suggestions.push(text);
    }

    this.setState(function getNewState() {
      return {
        inputText: text,
        suggestions: suggestions
      };
    });
  }

  handleInputFocus = (event, focused) => {
    this.setState(function getNewState() {
      return {
        inputFocused: focused
      };
    });
  }

  handleSelect = (suggestion, event) => {
    if(Utils.isBlank(this.state.inputText)) return;
    if(Utils.isBlank(suggestion)) {
      this.props.onSelect(this.state.inputText);
    }
    else {
      this.props.onSelect(suggestion);
    }
    this.setState(function getNewState() {
      return {
        inputText: '',
        suggestions: []
      };
    });
  }

  handleKeyDown = event => {
    switch(event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
        this.suggestions.handleKeyDown(event);
        break;
      default:
        return;
    }
  }
}

AutoComplete.propTypes = {
  choices: PropTypes.array,
  onSelect: PropTypes.func,
  maxSuggestionCount: PropTypes.number
};

AutoComplete.defaultProps = {
  choices: [],
  onSelect: () => {},
  maxSuggestionCount: null
}

export default AutoComplete;