'use strict';

const {blue} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends a log to the console and the main server of the bot
 * @param {string} text The text to log
 * @param {string} title The title to color blue
 * @returns {void}
 */
const log = (text, title = "") => {
    console.log(blue(title), text);
    sendServerLog(title, text);
}

module.exports = log;