'use strict';

/**
 * Converts cyan (0-100), magenta (0-100), yellow (0-100) and black (0-100)
 * into red (0-255), green (0-255) and blue (0-255) values
 * @param {number} cyan The cyan value
 * @param {number} magenta The magenta value
 * @param {number} yellow The yellow value
 * @param {number} black The black value
 * @returns {{
 *  red: number,
 *  green: number,
 *  blue: number
 * }} A dictionary with the red, green and blue values
 * @since 2020-12-12
 */
const cmykToRgb = (cyan, magenta, yellow, black) => {
    cyan /= 100;
    magenta /= 100;
    yellow /= 100;
    black /= 100;

    return {
        red: Math.round(255 * (1 - cyan) * (1 - black)),
        green: Math.round(255 * (1 - magenta) * (1 - black)),
        blue: Math.round(255 * (1 - yellow) * (1 - black))
    };
}

module.exports = cmykToRgb;