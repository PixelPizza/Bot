'use strict';

const cmykToRgb = require('./cmykToRgb');
const rgbToHex = require('./rgbToHex');

/**
 * Converts cyan (0-100), magenta (0-100), yellow (0-100) and black (0-100)
 * into a hexidecimal value
 * @param {number} cyan The cyan value
 * @param {number} magenta The magenta value
 * @param {number} yellow The yellow value
 * @param {number} black The black value
 * @returns {string} The hexidecimal value
 * @since 2020-12-12
 */
const cmykToHex = (cyan, magenta, yellow, black) => {
    const rgb = cmykToRgb(cyan, magenta, yellow, black);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}

module.exports = cmykToHex;