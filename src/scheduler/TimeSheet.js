import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import UserStatus from './UserStatus.js';
import { getCalendarWeek } from './SchedulerUtils.js';

import './TimeSheet.css';

// Two view modes
// Week View: Show week and time slots for yourself
// Day View: Show individual time slots and which users are available

class TimeSheet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      displayTimezone: moment.tz.guess(),
      test: {}
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
      timezone: props.timezone,
      status: {}
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

    const gridContents = [];

    // Top left corner is empty
    gridContents.push(<div key="control"><div onClick={this.handleClick.bind(this, WeekView.prevWeek)}>Back</div> <div onClick={this.handleClick.bind(this, WeekView.nextWeek)}>Forward</div></div>);
    const rowHeaders2 = [];
    rowHeaders2.push(<div key="col-header">Hour</div>);
    for(let dayCounter=0; dayCounter<weekSize; dayCounter++) {
      const displayDate = weekDays[dayCounter].format(`MMM Do`);
      const displayDay = weekDays[dayCounter].format(`ddd`);
      gridContents.push(<div key={'header1' + weekDays[dayCounter].unix()}>{displayDate}</div>);
      rowHeaders2.push(<div key={'header2' + weekDays[dayCounter].unix()}>{displayDay}</div>);
    }
    gridContents.push(rowHeaders2);

    for(let blockCounter=0; blockCounter<blocksPerDay; blockCounter++) {
      gridContents.push(<div className="weekview-content-row-header" key={`row-${blockCounter}-header`}>{1 + blockCounter%12} {blockCounter%12 === 0 ? 'AM' : 'PM'}</div>);
      for(let dayCounter=0; dayCounter<weekSize; dayCounter++) {
        const blockDate = calendarWeek.weekStart.clone().tz(this.state.timezone).set({minute: 0, hour: blockCounter}).add(dayCounter, 'days');
        const blockDateTimestamp = blockDate.unix();
        let status = undefined;
        if(this.state.status[blockDateTimestamp] !== undefined) {
          status = this.state.status[blockDateTimestamp];
        }
        gridContents.push(
          <div className={`grid-item col-${dayCounter} row-${blockCounter}`} key={blockDateTimestamp}>
            <UserStatus onClick={this.updateStatus.bind(this, blockDateTimestamp)} status={status} />
          </div>
        );
      }
    }

    return(
      <div className="weekview">
        <div className="weekview-grid">
          {gridContents}
        </div>
      </div>
    );
  }

  handleClick = fn => {
    this.setState(fn);
  }

  updateStatus = (id, newState) => {
    this.setState(function(state) {
      state.status[id] = newState.status;
      return {
        status: state.status
      };
    });
  }
}

WeekView.propTypes = {
  date: PropTypes.object,
  timezone: PropTypes.string
}

WeekView.nextWeek = function(state) {
  return {
    date: state.date.add(1, 'weeks')
  };
}

WeekView.prevWeek = function(state) {
  return {
    date: state.date.subtract(1, 'weeks')
  };
}






export default TimeSheet;