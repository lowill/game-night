import { getCalendarWeek } from './SchedulerUtils.js';

describe('getCalendarWeek method', () => {

  const testDate = "2018-10-17T08:30:00";
  it(`should return the dates for monday and sunday given the following date ${testDate} (UTC)`, () => {
    const timezone = "UTC";
    const actual = getCalendarWeek(testDate, timezone);
    const expected = {weekStart: "2018-10-15T00:00:00.000Z", weekEnd: "2018-10-21T23:59:59.999Z", timezone: timezone};
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });

  it(`should return the calendar week adjusted for JST`, () => {
    const timezone = "Asia/Tokyo";
    const actual = getCalendarWeek(testDate, timezone);
    const expected = {weekStart: "2018-10-14T15:00:00.000Z", weekEnd: "2018-10-21T14:59:59.999Z", timezone: "JST"};
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });

});