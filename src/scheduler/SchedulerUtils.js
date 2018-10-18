import moment from 'moment-timezone';

// Returns an array containing the week start date through week end date (Mon-Sun) for a specific timezone
function getCalendarWeek(date, timezone) {
  const momentDate = moment(date).tz(timezone);
  return {
    weekStart: momentDate.clone().startOf('isoWeek'),
    weekEnd: momentDate.clone().endOf('isoWeek'),
    timezone: momentDate.format('z')
  };
}

export { getCalendarWeek };