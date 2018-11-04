import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './TabButton.css';

class TabButton extends Component {
  render() {
    return(
      <div className='tab-button' onClick={this.handleClick} data-active={this.props.active}>
        {this.props.name}
      </div>
    );
  }

  handleClick = () => {
    this.props.onClick(this.props.id);
  }
}

TabButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool
};

export default TabButton;