import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './AutoCompleteSuggestions.css';

const DISPLAY_MODES = {
  FOCUS: 'focus',
  PERSISTENT: 'persistent'
};

class AutoCompleteSuggestions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hoveredIndex: null
    };
  }

  render() {
    const shouldHide = this.props.displayMode === DISPLAY_MODES.FOCUS && this.props.hasFocus === false;
    return(
      <div className='autocomplete-suggestions' data-hide={shouldHide}>
        {this.props.suggestions.map(this.renderSuggestions)}
      </div>
    );
  }

  renderSuggestions = (suggestion, index) => {
    const props = {
      'data-hover': this.state.hoveredIndex === index,
      'data-index': index,
      onMouseOver: this.handleSuggestionHovered.bind(null, index),
      onClick: this.handleSelect.bind(null, suggestion),
      key: suggestion
    }
    return <div className='autocomplete-suggestions-suggestion' {...props}>{suggestion}</div>
  }

  handleSuggestionHovered = (index, event) => {
    if(event.target !== null) {
      this.setState(function getNewState() {
        return {
          hoveredIndex: index
        };
      });
    }
  }

  handleSelect = (suggestion, event) => {
    this.props.onSelect(suggestion);
  }

  changeHoveredIndex = (modifier) => {
    return function(prevState, prevProps) {
      if(prevProps.suggestions === undefined) return;
      const lastIndex = prevProps.suggestions.length - 1;
      return {
        hoveredIndex: 
          (prevState.hoveredIndex === null && modifier < 0)
          ? lastIndex
          : (prevState.hoveredIndex === null && modifier > 0)
          ? 0
          : (modifier > 0 || modifier + prevState.hoveredIndex >= 0)
          ? (prevState.hoveredIndex + modifier) % prevProps.suggestions.length
          : (modifier % prevProps.suggestions.length) + prevProps.suggestions.length
      }
    }
  }

  handleKeyDown = (event) => {
    switch(event.key) {
      case 'ArrowDown':
        this.setState(this.changeHoveredIndex(1));
        break;
      case 'ArrowUp':
        this.setState(this.changeHoveredIndex(-1));
        break;
      case 'Enter':
        this.handleSelect(this.props.suggestions[this.state.hoveredIndex], event);
        break;
      default:
        return;
    }
  }
}

AutoCompleteSuggestions.propTypes = {
  suggestions: PropTypes.array,
  displayMode: PropTypes.oneOf(Object.values(DISPLAY_MODES)),
  hasFocus: PropTypes.bool,
  onSelect: PropTypes.func
};

AutoCompleteSuggestions.defaultProps = {
  suggestions: [],
  displayMode: DISPLAY_MODES.PERSISTENT,
  onSelect: () => {}
}

export default AutoCompleteSuggestions;