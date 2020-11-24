'use strict';

const {red} = require('chalk');
const sendServerLog = require("./sendServerLog");

const error = (text, title = "") => {
    console.log(red(title), text);
    sendServerLog(title, text);
}

module.exports = error;