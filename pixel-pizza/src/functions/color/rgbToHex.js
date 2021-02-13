'use strict';

/**
 * Changes a red (0-255), green (0-255) or blue (0-255) value to hex format
 * @param {number} rgbComponent The red, green or blue value
 * @returns {string} The hexidecimal value of the red, green or blue value
 * @since 2020-12-12
 */
const rgbComponentToHex = (rgbComponent) => {
    const hex = rgbComponent.toString(16);
    return hex.length == 1 ? `0${hex}` : hex;
}

/**
 * Converts red (0-255), blue (0-255) and green (0-255) values 
 * into a hexidecimal string
 * @param {number} red The red value
 * @param {number} green The green value
 * @param {number} blue The blue value
 * @returns {string} The hexidecimal value of the red, blue and green values
 * @since 2020-12-12
 */
const rgbToHex = (red, green, blue) => rgbComponentToHex(red) + rgbComponentToHex(green) + rgbComponentToHex(blue);

module.exports = rgbToHex;