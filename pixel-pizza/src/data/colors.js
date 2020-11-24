'use strict';

const createColor = (hex, rgb, hsl, cmyk) => { 
    if(typeof hex == "string" && Array.isArray(rgb) && Array.isArray(hsl) && Array.isArray(cmyk) && (hex.length == 6 || hex == "FFF" || hex == "000") && rgb.length == 3 && hsl.length == 3 && cmyk.length == 4){
        return {
            hex: `#${hex}`,
            rgb: rgb,
            hsl: hsl,
            cmyk: cmyk
        }
    }
    throw new Error("wrong color format");
};

const colors = {
    black: createColor("000", [0, 0, 0], [0, 0, 0], [0, 0, 0, 100]),
    white: createColor("FFF", [255, 255, 255], [0, 0, 100], [0, 0, 0, 0]),
    red: createColor("FF0000", [255, 0, 0], [0, 100, 50], [0, 100, 100, 0]),
    green: createColor("00FF00", [0, 255, 0], [120, 100, 50], [100, 0, 100, 0]),
    blue: createColor("0000FF", [0, 0, 255], [240, 100, 50], [100, 100, 0, 0]),
    yellow: createColor("FFFF00", [255, 255, 0], [60, 100, 50], [0, 0, 100, 0]),
    lightblue: createColor("00FFFF", [0, 255, 255], [180, 100, 50], [100, 0, 0, 0]),
    purple: createColor("FF00FF", [255, 0, 255], [300, 100, 50], [0, 100, 0, 0]),
    orange: createColor("FFA500", [255, 165, 0], [39, 100, 50], [0, 35, 100, 0]),
    silver: createColor("C0C0C0", [192, 192, 192], [0, 0, 75], [0, 0, 0, 25]),
    darkgray: createColor("A9A9A9", [169, 169, 169], [0, 0, 66], [0, 0, 0, 34]),
    gray: createColor("808080", [128, 128, 128], [0, 0, 50], [0, 0, 0, 50]),
    lightgray: createColor("D3D3D3", [211, 211, 211], [0, 0, 83], [0, 0, 0, 17]),
    levels: {
        front: createColor("CCCCCC", [204, 204, 204], [0, 0, 80], [0, 0, 0, 20]),
        back: createColor("000", [0, 0, 0], [0, 0, 0], [0, 0, 0, 100]),
        expfront: createColor("FF0000", [255, 0, 0], [0, 100, 50], [0, 100, 100, 0]),
        expback: createColor("FFF", [255, 255, 255], [0, 0, 100], [0, 0, 0, 0]),
    }
};

module.exports = Object.assign({
    darkgrey: colors.darkgray,
    grey: colors.gray,
    lightgrey: colors.lightgray
}, colors);