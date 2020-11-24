'use strict';

const sendEmbed = (embed, message) => message.channel.send(message.client.canSendEmbeds ? embed : embed.description);

module.exports = sendEmbed;