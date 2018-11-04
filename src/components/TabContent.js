import React, { Component } from 'react';
import './TabContent.css';

class TabContent extends Component {
  render() {
    return(
      <div className="tab-content">
        {this.props.children}
      </div>
    );
  }
}

export default TabContent;