'use strict';

/**
 * Changes a timestamp into a time string in HH-mm-ss format
 * @param {number} [timestamp] The amount of seconds from 1970-01-01 00:00:00
 * @param {boolean} [addFormat] If an explanation of the format should be appended
 * @returns {string} The time as a string (HH-mm-ss)
 */
const timestampToDate = (timestamp = 0, addFormat = true) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}${addFormat ? " (HH:mm:ss)" : ""}`;
}

module.exports = timestampToDate;