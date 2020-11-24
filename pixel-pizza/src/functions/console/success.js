'use strict';

const {green} = require('chalk');
const sendServerLog = require("./sendServerLog");

const success = (text, title = "") => {
    console.log(green(title), text);
    sendServerLog(title, text);
}

module.exports = success;