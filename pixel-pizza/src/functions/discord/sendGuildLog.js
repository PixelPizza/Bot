'use strict';

const {log} = require("../../data/webhooks");
const discord = require("discord.js");

/**
 * send a webhook message in the guild logs channel
 * @param {string} name the name of the webhook
 * @param {string} avatar the avatar url of the webhook
 * @param {discord.MessageResolvable} message the message to send with the webhook
 * @returns {Promise<void>}
 */
const sendGuildLog = async (name, avatar, message) => {
    const webhook = new discord.WebhookClient(log.id, log.token);
    await webhook.edit({ name: name, avatar: avatar });
    webhook.send(message);
}

module.exports = sendGuildLog;