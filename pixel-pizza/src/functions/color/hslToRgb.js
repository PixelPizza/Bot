'use strict';

/**
 * Convert hue to the red (0-1), blue (0-1) or green channel (0-1)
 * @param {number} p 
 * @param {number} q 
 * @param {number} t 
 * @returns {number} the red, blue or green channel
 * @since 2020-12-12
 */
const hueToRgb = (p, q, t) => {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1 / 6) return p + (q - p) * 6 * t;
    if(t < 1 / 2) return q;
    if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

/**
 * Converts hue (0-360), saturation (0-100) and lightness (0-100) 
 * into red (0-255), green (0-255) and blue (0-255) values
 * @param {number} hue The hue value
 * @param {number} saturation The saturation value
 * @param {number} lightness The lightness value
 * @returns {{
 *  red: number,
 *  green: number,
 *  blue: number
 * }} A dictionary with the red, blue and green values
 * @since 2020-12-12
 */
const hslToRgb = (hue, saturation, lightness) => {
    let red, green, blue;

    if(saturation == 0){
        red = green = blue = lightness;
    } else {
        const q = lightness < .5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
        const p = 2 * lightness - q;
        red = hueToRgb(q, p, hue + 1 / 3);
        green = hueToRgb(q, p, hue);
        blue = hueToRgb(q, p, hue - 1 / 3);
    }

    return {
        red: red,
        green: green,
        blue: blue
    };
}

module.exports = hslToRgb;