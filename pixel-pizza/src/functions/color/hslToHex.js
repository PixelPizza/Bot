'use strict';

const hslToRgb = require('./hslToRgb');
const rgbToHex = require('./rgbToHex');

/**
 * Converts hue (0-360), saturation (0-100) and lightness (0-100)
 * into a hexidecimal value
 * @param {number} hue The hue value
 * @param {number} saturation The saturation value
 * @param {number} lightness The lightness value
 * @returns {string} The hexidecimal value
 * @since 2020-12-12
 */
const hslToHex = (hue, saturation, lightness) => {
    const rgb = hslToRgb(hue, saturation, lightness);
    return rgbToHex(rgb.red, rgb.green, rgb.blue);
}