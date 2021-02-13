'use strict';

/**
 * Converts red (0-255), blue (0-255) and green (0-255) values 
 * into hue (0-360), saturation (0-100) and lightness (0-100) values
 * @param {number} red The red value
 * @param {number} green The green value
 * @param {number} blue The blue value
 * @returns {{
 *  hue: number,
 *  saturation: number,
 *  lightness: number
 * }} A dictionary with the hue, saturation and lightness values
 * @since 2020-12-12
 */
const rgbToHsl = (red, green, blue) => {
    red /= 255;
    green /= 255;
    blue /= 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const chroma = max - min;
    
    const hue = chroma == 0 ? 0 : (max == red ? ((green - blue) / chroma) % 6 : (max == green ? 2 + (blue - red) / chroma : 4 + (red -green) / chroma));
    const lightness = (max + min) * .5;
    const saturation = chroma == 0 ? 0 : (lightness > .5 ? chroma / (2 - max - min) : chroma / (max + min));

    return {
        hue: Math.round(hue * 60),
        saturation: Math.round(saturation * 100),
        lightness: Math.round(lightness * 100)
    }
}

module.exports = rgbToHsl;