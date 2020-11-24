'use strict';

const {redBright} = require('chalk');
const sendServerLog = require("./sendServerLog");

const fatal = (text, title = "") => {
    console.log(redBright(title), text);
    sendServerLog(title, text);
}

module.exports = fatal;