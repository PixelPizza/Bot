'use strict';

const timestampToDate = (timestamp = 0) => {
    const date = new Date(timestamp);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} (dd-mm-YYYY)`;
}

module.exports = timestampToDate;