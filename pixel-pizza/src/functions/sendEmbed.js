'use strict';

const { Message, TextChannel, MessageEmbed } = require("discord.js");

/**
 * send an embed to a channel
 * @returns {void}
 */
const sendEmbed = function(){
    const embed = arguments[0];
    const client = arguments[1];
    if(arguments[2] instanceof Message){
        arguments[2].channel.send(client.canSendEmbeds ? embed : embed.description);
    } else if (arguments[2] instanceof TextChannel){
        arguments[2].send(client.canSendEmbeds ? embed : embed.description);
    }
}

module.exports = sendEmbed;