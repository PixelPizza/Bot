'use strict';

/**
 * Changes a timestamp into a date string in dd-mm-YYYY format
 * @param {number} timestamp The amount of seconds from 1970-01-01 00:00:00
 * @returns {string} The date as a string (dd-mm-YYYY)
 */
const timestampToDate = (timestamp = 0) => {
    const date = new Date(timestamp);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} (dd-mm-YYYY)`;
}

module.exports = timestampToDate;