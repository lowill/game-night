import React, { Component } from 'react';
import TabButton from './TabButton.js';
import TabContent from './TabContent.js';

import './TabGroup.css';

class TabGroup extends Component {

  constructor(props) {
    super(props);

    // get the default tab if one was set
    let defaultTabId = 0;
    this.props.children.forEach((child, index) => {
      if(child.type.name !== 'TabItem') console.warn(`Children of TabGroup should be TabItem.`);
      defaultTabId = child.props.default === true ? index : defaultTabId
    });

    this.state = {
      activeTabId: defaultTabId
    }
  }

  render() {
    return(
      <div className="tab-group">
        <div className="tab-group-buttons">{this.renderTabButtons()}<div className="tab-group-button-fill"/></div>
        <div className="tab-group-content-panel">{this.renderContent()}</div>
      </div>
    );
  }

  renderTabButtons = () => {
    return this.props.children.map((child, index) => {
      return <TabButton name={child.props.label} id={index} key={index} onClick={this.handleTabButtonClick} active={this.state.activeTabId === index} />
    });
  }

  renderContent = () => {
    for(let childIndex in this.props.children) {
      if(Number(childIndex) !== this.state.activeTabId) continue;
      return <TabContent>{this.props.children[childIndex].props.children}</TabContent>
    }
  }

  handleTabButtonClick = tabId => {
    this.setState(function getNewState() {
      return {
        activeTabId: tabId
      };
    });
  }

}

export default TabGroup;