'use strict';

const {gray} = require('chalk');
const sendServerLog = require("./sendServerLog");

/**
 * Sends a notice log to the console and the main server of the bot
 * @param {string} text The text to log as notice
 * @param {string} title The title to color gray
 * @returns {void}
 */
const notice = (text, title = "") => {
    console.log(gray(title), text);
    sendServerLog(title, text);
}

module.exports = notice;