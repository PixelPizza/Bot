'use strict';

const sendEmbedWithChannel = (embed, client, channel) => channel.send(client.canSendEmbeds ? embed : embed.description);

module.exports = sendEmbedWithChannel;