'use strict';

const {blueBright} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends an info log to the console and the main server of the bot
 * @param {string} text The text to log as info
 * @param {string} title The title to color bright blue
 * @returns {void}
 */
const info = (text, title = "") => {
    console.log(blueBright(title), text);
    sendServerLog(title, text);
}

module.exports = info;