import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Config from '../Config.js';

class OverviewProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selections: [],
      calendar: {}
    };
  }

  componentDidMount() {
    const group = this.props.settings.get('group');
    const username = this.props.settings.get('username');

    Promise.all([
      fetchGameSelections(group),
      fetchCalendar(group)
    ])
      .then(results => results.map(result => result.ok ? result.json() : new Error('Failed to fetch')))
      .then(console.log)
  }

  render() {
    return(
      <div className="overview-provider">
        {
          React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, this.state);
          })
        }
      </div>
    );
  }


}

function fetchGameSelections(group) {
  return fetch(new URL('../games/selected', Config.server_url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ group })
  });
}

function fetchCalendar(group) {
  return fetch(new URL('../calendar', Config.server_url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ group })
  });
}

export default OverviewProvider;