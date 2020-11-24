'use strict';

const {blueBright} = require('chalk');
const sendServerLog = require("./sendServerLog");

const info = (text, title = "") => {
    console.log(blueBright(title), text);
    sendServerLog(title, text);
}

module.exports = info;