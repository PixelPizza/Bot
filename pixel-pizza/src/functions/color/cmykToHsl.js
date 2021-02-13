'use strict';

const cmykToRgb = require('./cmykToRgb');
const rgbToHsl = require('./rgbToHsl');

/**
 * Converts cyan (0-100), magenta (0-100), yellow (0-100) and black (0-100)
 * into hue (0-360), saturation (0-100) and lightness (0-100) values
 * @param {number} cyan The cyan value
 * @param {number} magenta The magenta value
 * @param {number} yellow The yellow value
 * @param {number} black The black value
 * @returns {{
 *  hue: number,
 *  saturation: number,
 *  lightness: number
 * }} A dictionary with the hue, saturation and lightness values
 * @since 2020-12-12
 */
const cmykToHsl = (cyan, magenta, yellow, black) => {
    const rgb = cmykToRgb(cyan, magenta, yellow, black);
    return rgbToHsl(rgb.red, rgb.green, rgb.blue);
}

module.exports = cmykToHsl;