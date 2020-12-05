'use strict';

const notice = require("./notice");

/**
 * Clear the console and send a notice that it has been cleared
 * @returns {void}
 */
const clear = () => {
    console.clear();
    notice('Clear', 'The console was cleared');
}

module.exports = clear;