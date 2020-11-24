'use strict';

const {yellow} = require('chalk');
const sendServerLog = require("./sendServerLog");

const warn = (text, title = "") => {
    console.log(yellow(title), text);
    sendServerLog(title, text);
}

module.exports = warn;