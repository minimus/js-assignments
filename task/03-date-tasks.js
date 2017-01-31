'use strict';

/********************************************************************************************
 *                                                                                          *
 * Plese read the following tutorial before implementing tasks:                             *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Date_object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date    *
 *                                                                                          *
 ********************************************************************************************/


/**
 * Parses a rfc2822 string date representation into date value
 * For rfc2822 date specification refer to : http://tools.ietf.org/html/rfc2822#page-14
 *
 * @param {string} value
 * @return {date}
 *
 * @example:
 *    'December 17, 1995 03:24:00'    => Date()
 *    'Tue, 26 Jan 2016 13:48:02 GMT' => Date()
 *    'Sun, 17 May 1998 03:00:00 GMT+01' => Date()
 */
function parseDataFromRfc2822(value) {
  /*let
    date = new Date(),
    sd = value.split(' '),
    dayOfWeek = ((String(sd[0]).endsWith(',')) ? sd[0] : ''),
    day = ((dayOfWeek != '') ? sd[1] : sd[0]),
    month = ((dayOfWeek != '') ? sd[2] : sd[1]),
    year = ((dayOfWeek != '') ? sd[3] : sd[2]),
    time = ((dayOfWeek != '') ? sd[4] : sd[3]),
    utc = ((dayOfWeek != '') ? ((6 == sd.length) ? sd[5] : '') : ((5 == sd.length) ? sd[4] : ''));
  if (0 == utc.startsWith('GMT')) {
    if (utc.length > 3) {
      utc = utc.replace('GMT', '');
      if (utc.length < 5) utc += '0'.repeat(5 - utc.length);
    }
  }
  else if (utc.length < 5) utc += '0'.repeat(5 - utc.length);
  let dateStr = [dayOfWeek, day, month, year, time, utc].join(' ');
  return date.setTime(Date.parse(dateStr));*/
  throw new Error('Not implemented');
  //let date = new Date();
  //return date.setTime(Date.parse(value));
}

/**
 * Parses an ISO 8601 string date representation into date value
 * For ISO 8601 date specification refer to : https://en.wikipedia.org/wiki/ISO_8601
 *
 * @param {string} value
 * @return {date}
 *
 * @example :
 *    '2016-01-19T16:07:37+00:00'    => Date()
 *    '2016-01-19T08:07:37Z' => Date()
 */
function parseDataFromIso8601(value) {
  let date = new Date();
  return date.setTime(Date.parse(value));
}


/**
 * Returns true if specified date is leap year and false otherwise
 * Please find algorithm here: https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * @param {date} date
 * @return {bool}
 *
 * @example :
 *    Date(1900,1,1)    => false
 *    Date(2000,1,1)    => true
 *    Date(2001,1,1)    => false
 *    Date(2012,1,1)    => true
 *    Date(2015,1,1)    => false
 */
function isLeapYear(date) {
  let year = date.getFullYear();
  if (year % 4) return false;
  else if (year % 100) return true;
  else return !(year % 400);
}


/**
 * Returns the string represention of the timespan between two dates.
 * The format of output string is "HH:mm:ss.sss"
 *
 * @param {date} startDate
 * @param {date} endDate
 * @return {string}
 *
 * @example:
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,11,0,0)   => "01:00:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,30,0)       => "00:30:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,20)        => "00:00:20.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,0,250)     => "00:00:00.250"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,15,20,10,453)   => "05:20:10.453"
 */
function timeSpanToString(startDate, endDate) {
  let
    h = endDate.getHours() - startDate.getHours(),
    m = endDate.getMinutes() - startDate.getMinutes(),
    s = endDate.getSeconds() - startDate.getSeconds(),
    ms = endDate.getMilliseconds() - startDate.getMilliseconds();
  return `${(h > 9) ? h : '0' + h}:${(m > 9) ? m : '0' + m}:${(s > 9) ? s : '0' + s}.${(ms > 9) ? ((ms > 99) ? ms : '0' + ms) : '00' + ms}`;
}


/**
 * Returns the angle (in radians) between the hands of an analog clock for the specified Greenwich time.
 * If you have problem with solution please read: https://en.wikipedia.org/wiki/Clock_angle_problem
 *
 * @param {date} date
 * @return {number}
 *
 * @example:
 *    Date.UTC(2016,2,5, 0, 0) => 0
 *    Date.UTC(2016,3,5, 3, 0) => Math.PI/2
 *    Date.UTC(2016,3,5,18, 0) => Math.PI
 *    Date.UTC(2016,3,5,21, 0) => Math.PI/2
 */
function angleBetweenClockHands(date) {
  let
    h = date.getHours() + (date.getTimezoneOffset() / 60),
    m = date.getMinutes(),
    deg = 0.5 * (60 * ((h > 12) ? h - 12 : h) - 11 * m);
  if (deg < 0) deg *= -1;
  return ((deg > 180) ? 360 - deg : deg) * Math.PI / 180;
}


module.exports = {
  parseDataFromRfc2822: parseDataFromRfc2822,
  parseDataFromIso8601: parseDataFromIso8601,
  isLeapYear: isLeapYear,
  timeSpanToString: timeSpanToString,
  angleBetweenClockHands: angleBetweenClockHands
};
