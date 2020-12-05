'use strict';

const {yellow} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends a watning log to the console and the main server of the bot
 * @param {string} text The text to log as warning
 * @param {string} title The title to color yellow
 * @returns {void}
 */
const warn = (text, title = "") => {
    console.log(yellow(title), text);
    sendServerLog(title, text);
}

module.exports = warn;