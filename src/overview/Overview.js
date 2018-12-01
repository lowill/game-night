import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

class Overview extends Component {



  render() {
    const usernames = Object.values(this.props.calendarSelections)
      .map(calendarItem => calendarItem.name);

    const uniqueUsernames = [...new Set(usernames)];

    return(
      <div className="overview">
        <h2 className="time-view">{moment.unix(this.props.selectedTime).format('')}</h2> 
        <h2 className="overview-header">Available Users</h2>
        <ul className="overview-user-list">
          {uniqueUsernames}
        </ul>
      </div>
    );
  }
}

Overview.propTypes = {
  selectedGames: PropTypes.array,
  calendarSelections: PropTypes.object,
  selectedTime: PropTypes.number
};

Overview.defaultProps = {
  selectedGames: [],
  calendarSelections: {},
  selectedTime: moment().startOf('hour').unix()
};

export default Overview;