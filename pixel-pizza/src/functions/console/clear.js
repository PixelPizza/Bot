'use strict';

const notice = require("./notice");

const clear = () => {
    console.clear();
    notice('Clear', 'The console was cleared');
}

module.exports = clear;