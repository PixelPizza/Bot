'use strict';

const hexToRgb = require('../functions/color/hexToRgb');
const hexToHsl = require('../functions/color/hexToHsl');
const hexToCmyk = require('../functions/color/hexToCmyk');

/**
 * Create a color using color values
 * @param {string} hex The hex value of the color
 * @returns {{
 *  hex: string,
 *  rgb: [number, number, number],
 *  hsl: [number, number, number],
 *  cmyk: [number, number, number, number]
 * }} A dictonary with color values
 * @throws An error if the color values were not formatted correctly
 */
const createColor = (hex) => {
    hex = (hex.charAt(0) == '#' ? hex.substring(1) : hex).toUpperCase();
    if(typeof hex == "string" && /^([0-9A-F]{6}|[0-9A-F]{3})$/.test(hex)){
        const rgb = hexToRgb(hex);
        const hsl = hexToHsl(hex);
        const cmyk = hexToCmyk(hex);
        hex = hex.length == 6 ? hex : `${hex[0].repeat(2)}${hex[1].repeat(2)}${hex[2].repeat(2)}`
        return {
            hex: `#${hex}`,
            rgb: [rgb.red, rgb.green, rgb.blue],
            hsl: [hsl.hue, hsl.saturation, hsl.lightness],
            cmyk: [cmyk.cyan, cmyk.magenta, cmyk.yellow, cmyk.black]
        }
    }
    throw new Error("wrong color format");
}

/**
 * A dictonary with color values in hex, rgb, hsl and cmyk format
 */
const colors = {
    black: createColor("000"),
    white: createColor("FFF"),
    red: createColor("FF0000"),
    darkred: createColor("8B0000"),
    green: createColor("00FF00"),
    darkgreen: createColor("006400"),
    blue: createColor("0000FF"),
    yellow: createColor("FFFF00"),
    gold: createColor("FFD700"),
    lightblue: createColor("00FFFF"),
    purple: createColor("FF00FF"),
    orange: createColor("FFA500"),
    silver: createColor("C0C0C0"),
    darkgray: createColor("A9A9A9"),
    gray: createColor("808080"),
    lightgray: createColor("D3D3D3"),
    noiceboard: createColor("C01E1E")
};

module.exports = Object.assign({
    darkgrey: colors.darkgray,
    grey: colors.gray,
    lightgrey: colors.lightgray,
    levels: {
        front: createColor("CCCCCC"),
        back: colors.black,
        expfront: colors.red,
        expback: colors.white
    }
}, colors);