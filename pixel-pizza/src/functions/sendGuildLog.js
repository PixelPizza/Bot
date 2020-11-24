'use strict';

const {log} = require("../data/webhooks");

/**
 * send a webhook message in the guild logs channel
 * @param {string} name the name of the webhook
 * @param {string} avatar the avatar url of the webhook
 * @param {string} message the message to send with the webhook
 */
const sendGuildLog = async (name, avatar, message) => {
    const webhook = new WebhookClient(log.id, log.token);
    await webhook.edit({ name: name, avatar: avatar });
    webhook.send(message);
}

module.exports = sendGuildLog;