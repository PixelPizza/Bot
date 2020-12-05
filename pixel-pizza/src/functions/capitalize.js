'use strict';

/**
 * Captialize a string
 * @param {string} string The string to capitalize
 * @returns {string} The capitalized string
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();

module.exports = capitalize;