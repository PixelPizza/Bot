'use strict';

/**
 * Convert ms to a time string with days, hours, minutes, seconds and miliseconds
 * @param {number} ms The amount of miliseconds
 * @returns {string} the days, hours, minutes, seconds and miliseconds in a string
 * @since 2020-12-13
 */
const msToString = (ms, showMs = false) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h ${m % 60}m ${s % 60 ? s % 60 : (showMs ? 0 : 1)}s${showMs ? ` ${ms % 1000}ms` : ""}`;
}

module.exports = msToString;