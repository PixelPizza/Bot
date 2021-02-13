'use strict';

const hexToRgb = require('./hexToRgb');
const rgbToHsl = require('./rgbToHsl');

/**
 * Converts a hexidecimal string 
 * into hue (0-360), saturation (0-100) and lightness (0-100) values
 * @param {string} hex The hexidecimal string
 * @returns {{
 *  hue: number,
 *  saturation: number,
 *  lightness: number
 * }} A dictionary with the hue, saturation and lightness values
 * @since 2020-12-12
 */
const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb.red, rgb.green, rgb.blue);
}

module.exports = hexToHsl;