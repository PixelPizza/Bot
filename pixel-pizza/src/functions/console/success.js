'use strict';

const {green} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends an success log to the console and the main server of the bot
 * @param {string} text The text to log as success
 * @param {string} title The title to color green
 * @returns {void}
 */
const success = (text, title = "") => {
    console.log(green(title), text);
    sendServerLog(title, text);
}

module.exports = success;