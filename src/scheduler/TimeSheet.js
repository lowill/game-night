import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import UserStatus from './UserStatus.js';
import { getCalendarWeek } from './SchedulerUtils.js';

import './TimeSheet.css';

// Two view modes
// Week View: Show week and time slots with many "subscribers"
// Day View: Show individual time slots and which users are available

class TimeSheet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      displayTimezone: moment.tz.guess()
    };
  }
  render() {
    return(
      <div className="timesheet">
        <WeekView date={this.state.date} timezone={this.state.displayTimezone} />
      </div>
    );
  }
}

TimeSheet.DEFAULT_TIMEZONE = 'Asia/Tokyo';

TimeSheet.defaultProps = {
  displayTimezone: TimeSheet.DEFAULT_TIMEZONE
};

class WeekView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      timezone: props.timezone
    };
  }
  render() {

    const blockSize = 1;  // TODO: Make dynamic later
    const blocksPerDay = 24/blockSize;

    const weekSize = 7; // may or may not be possible to set this to another value in the future
    const calendarWeek = getCalendarWeek(this.state.date, this.state.timezone);

    // get date moments for each day of the week
    const weekDays = [];
    let currentDate = calendarWeek.weekStart.clone();
    for(let i=0; i<weekSize; i++) {
      weekDays.push(currentDate);
      currentDate = currentDate.clone().add(1, 'days');
    }

    const blocks = [];
    for(let dayCounter=0; dayCounter<weekSize; dayCounter++) {
      blocks[dayCounter] = [];
      for(let blockCounter=0; blockCounter<blocksPerDay; blockCounter++) {
        const blockDate = calendarWeek.weekStart.clone().tz(this.state.timezone).set({minute: 0, hour: blockCounter}).add(dayCounter, 'days');
        blocks[dayCounter].push(<td key={blockDate.unix()}><UserStatus/></td>);
      }
    }

    // set table headers
    const tableHeaders1 = [];
    const tableHeaders2 = [];
    // Top left corner is empty
    tableHeaders1.push(<th key="empty">&nbsp;</th>);
    tableHeaders2.push(<th key="col-header">Hour</th>);
    for(let dayCounter=0; dayCounter<weekSize; dayCounter++) {
      const displayDate = weekDays[dayCounter].format(`MMM Do`);
      const displayDay = weekDays[dayCounter].format(`ddd`);
      tableHeaders1.push(<th key={weekDays[dayCounter].unix()}>{displayDate}</th>);
      tableHeaders2.push(<th key={weekDays[dayCounter].unix()}>{displayDay}</th>);
    }

    const blockRows = [];
    for(let blockCounter=0; blockCounter<blocksPerDay; blockCounter++) {
      const rowContents = [];
      rowContents.push(<th key={`row-${blockCounter}-header`}>{blockCounter%12 + 1} {blockCounter%12 === 0 ? 'AM' : 'PM'}</th>);

      for(let dayCounter=0; dayCounter<weekSize; dayCounter++) {
        rowContents.push(blocks[dayCounter][blockCounter]);
      }

      blockRows.push(<tr>{rowContents}</tr>);
    }

    return(
      <div className="weekview">
        <table className="weekview-table">
          <tbody>
            <tr>{tableHeaders1}</tr>
            <tr>{tableHeaders2}</tr>
              {blockRows}
          </tbody>
        </table>
      </div>
    );
  }
}

WeekView.propTypes = {
  date: PropTypes.object,
  timezone: PropTypes.string
}




export default TimeSheet;