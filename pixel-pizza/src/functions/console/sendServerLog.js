'use strict';

const {WebhookClient} = require('discord.js');
const {serverLog} = require("../../data/webhooks");

/**
 * Send a log to the console of the main server
 * @param {string} text The text to log
 * @param {string} title The title of the log
 * @returns {Promise<void>}
 */
const sendServerLog = async (text, title = "") => {
    const logger = new WebhookClient(serverLog.id, serverLog.token);
    await logger.edit({
        name: "Console",
        reason: "Just to be sure the name is right"
    });
    logger.send(`\`\`\`md\n[${title}]: ${text}\n\`\`\``);
}

module.exports = sendServerLog;