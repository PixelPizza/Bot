'use strict';

const { isUri } = require('valid-url');

const isImage = url => isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);

module.exports = isImage;