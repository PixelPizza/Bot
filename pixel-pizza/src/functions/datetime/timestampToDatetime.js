'use strict';

const timestampToDate = require('./timestampToDate');
const timestampToTime = require('./timestampToTime');

/**
 * Changes a timestamp into a time string in dd-mm-YYYY HH-mm-ss format
 * @param {number} [timestamp] The amount of seconds from 1970-01-01 00:00:00
 * @param {boolean} [addFormat] If an explanation of the format should be appended
 * @returns {string} The time as a string (dd-mm-YYYY HH-mm-ss)
 */
const timestampToDatetime = (timestamp = 0, addFormat = true) => `${timestampToDate(timestamp, false)} ${timestampToTime(timestamp, false)}${addFormat ? " (dd-mm-YYYY HH:mm:ss)": ""}`;

module.exports = timestampToDatetime;