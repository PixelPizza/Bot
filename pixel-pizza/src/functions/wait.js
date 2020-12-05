'use strict';

/**
 * Set a timeout
 * @param {number} ms The miliseconds the timeout lasts
 * @returns {Promise<[]>} A promise with an empty array
 */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = wait;