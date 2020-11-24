'use strict';

const {WebhookClient} = require('discord.js');
const {serverLog} = require("../../data/webhooks");

const sendServerLog = async (text, title = "") => {
    const logger = new WebhookClient(serverLog.id, serverLog.token);
    await logger.edit({
        name: "Console",
        reason: "Just to be sure the name is right"
    });
    logger.send(`\`\`\`md\n[${title}]: ${text}\n\`\`\``);
}

module.exports = sendServerLog;