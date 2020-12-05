'use strict';

const {redBright} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends a fatal error log to the console and the main server of the bot
 * @param {string} text The text to log as fatal error
 * @param {string} title The title to color bright red
 * @returns {void}
 */
const fatal = (text, title = "") => {
    console.log(redBright(title), text);
    sendServerLog(title, text);
}

module.exports = fatal;