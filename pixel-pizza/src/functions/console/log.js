'use strict';

const {blue} = require('chalk');
const sendServerLog = require("./sendServerLog");

const log = (text, title = "") => {
    console.log(blue(title), text);
    sendServerLog(title, text);
}

module.exports = log;