'use strict';

const {red} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends a error log to the console and the main server of the bot
 * @param {string} text The text to log as error
 * @param {string} title The title to color red
 * @returns {void}
 */
const error = (text, title = "") => {
    console.log(red(title), text);
    sendServerLog(title, text);
}

module.exports = error;