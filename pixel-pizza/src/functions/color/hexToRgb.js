'use strict';

/**
 * Converts a hexidecimal string 
 * into red (0-255), green (0-255) and blue (0-255) values
 * @param {string} hex The hexidecimal string
 * @returns {{
 *  red: number,
 *  green: number,
 *  blue: number
 * }} A dictionary with the red, green and blue values
 * @since 2020-12-12
 */
const hexToRgb = (hex) => {
    hex = hex.charAt(0) == "#" ? hex.substring(1) : hex;
    return {
        red: parseInt(hex.substring(0, 2), 16),
        green: parseInt(hex.substring(2, 4), 16),
        blue: parseInt(hex.substring(4, 6), 16)
    };
}

module.exports = hexToRgb;