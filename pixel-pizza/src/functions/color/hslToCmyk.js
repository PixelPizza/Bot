'use strict';

const hslToRgb = require('./hslToRgb');
const rgbToCmyk = require('./rgbToCmyk');

/**
 * Converts hue (0-360), saturation (0-100) and lightness (0-100)
 * into cyan (0-100), magenta (0-100), yellow (0-100) and black (0-100) values
 * @param {number} hue The hue value
 * @param {number} saturation The saturation value
 * @param {number} lightness The lightness value
 * @returns {{
 *  cyan: number,
 *  magenta: number,
 *  yellow: number,
 *  black: number
 * }} A dictionary with the cyan, magenta, yellow and black values
 * @since 2020-12-12
 */
const hslToCmyk = (hue, saturation, lightness) => {
    const rgb = hslToRgb(hue, saturation, lightness);
    return rgbToCmyk(rgb.red, rgb.green, rgb.blue);
}

module.exports = hslToCmyk;