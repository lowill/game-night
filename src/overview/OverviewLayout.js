import React, { Component } from 'react';
import Overview from './Overview.js';
import OverviewProvider from './OverviewProvider.js';

class OverviewLayout extends Component {

  render() {
    return(
      <div className="overview-layout">
        <div className="overview-left">

        </div>
        <div className="overview-right">
          <OverviewProvider {...this.props}>
            <Overview/>
          </OverviewProvider>
        </div>
      </div>
    );
  }
  
}

export default OverviewLayout;