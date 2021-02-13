'use strict';

const hexToRgb = require('./hexToRgb');
const rgbToCmyk = require('./rgbToCmyk');

/**
 * Converts a hexidecimal string 
 * into cyan (0-100), magenta (0-100), yellow (0-100) and black (0-100) values
 * @param {string} hex The hexidecimal string
 * @returns {{
 *  cyan: number,
 *  magenta: number,
 *  yellow: number,
 *  black: number
 * }} A dictionary with the cyan, magenta, yellow and black values
 * @since 2020-12-12
 */
const hexToCmyk = (hex) => {
    const rgb = hexToRgb(hex);
    return rgbToCmyk(rgb.red, rgb.green, rgb.blue);
}

module.exports = hexToCmyk;