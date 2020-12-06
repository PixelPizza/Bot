'use strict';

const { Message, TextChannel } = require("discord.js");

/**
 * send an embed to a channel
 * @returns {Promise<Message>}
 */
const sendEmbed = function(){
    const embed = arguments[0];
    const client = arguments[1];
    if(arguments[2] instanceof Message){
        return arguments[2].channel.send(client.canSendEmbeds ? embed : embed.description);
    } else if (arguments[2] instanceof TextChannel){
        return arguments[2].send(client.canSendEmbeds ? embed : embed.description);
    }
}

module.exports = sendEmbed;