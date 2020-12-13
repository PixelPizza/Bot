'use strict';

/**
 * Converts red (0-255), blue (0-255) and green (0-255) values 
 * into cyan (0-100), magenta (0-100), yellow (0-100) and black (0-100) values
 * @param {number} red The red value
 * @param {number} green The green value
 * @param {number} blue The blue value
 * @returns {{
 *  cyan: number,
 *  magenta: number,
 *  yellow: number,
 *  black: number
 * }} A dictionary with the cyan, magenta, yellow and black values
 * @since 2020-12-12
 */
const rgbToCmyk = (red, green, blue) => {
    if(red == 0 && green == 0 && blue == 0) return {
        cyan: 0,
        magenta: 0,
        yellow: 0,
        black: 100
    };

    const cyan = 1 - (red / 255), magenta = 1 - (green / 255), yellow = 1 - (blue / 255);
    const minCMY = Math.min(cyan, magenta, yellow);

    return {
        cyan: Math.round((cyan - minCMY) / (1 - minCMY) * 100),
        magenta: Math.round((magenta - minCMY) / (1 - minCMY) * 100),
        yellow: Math.round((yellow - minCMY) / (1 - minCMY) * 100),
        black: Math.round(minCMY * 100)
    };
}

module.exports = rgbToCmyk;