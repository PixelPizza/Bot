'use strict';

const {gray} = require('chalk');
const sendServerLog = require("./sendServerLog");

const notice = (text, title = "") => {
    console.log(gray(title), text);
    sendServerLog(title, text);
}

module.exports = notice;