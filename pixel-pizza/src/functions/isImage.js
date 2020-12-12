'use strict';

const { isUri } = require('valid-url');

/**
 * Check if a url points to an image
 * @param {string} url the url to use as image
 * @returns {boolean} If the url is an image
 */
const isImage = url => isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url.indexOf("?") != -1 ? url.substring(0, url.indexOf("?"))  : url);

module.exports = isImage;