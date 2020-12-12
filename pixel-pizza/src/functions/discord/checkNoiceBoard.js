'use strict';

const discord = require('discord.js');
const {text} = require("../../data/channels");
const {noice2} = require("../../data/emojis");
const {noiceboardMinValue} = require("../../data/config");
const {noiceboard} = require("../../data/colors");
const createEmbed = require("./createEmbed");

/**
 * check if a message from a messageReaction is good enough for the noice board
 * @param {discord.MessageReaction} messageReaction The messageReaction to check the message of
 * @returns {void | Promise<Message>} Returns a promise with the noiceboard message if it was added to the noiceboard
 */
const checkNoiceBoard = messageReaction => {
    const guild = messageReaction.message.guild;
    const member = messageReaction.message.member;
    const channel = guild.channels.cache.get(text.noiceboard);
    const emoji = guild.emojis.cache.get(noice2);
    const embedMsg = createEmbed({
        color: noiceboard.hex,
        author: {
            name: member.displayName,
            icon: member.user.displayAvatarURL()
        },
        description: messageReaction.message.content,
        fields: [{
            name: "Message",
            value: `[Jump to message](${messageReaction.message.url})`
        }],
        timestamp: true,
        footer: { text: messageReaction.message.id }
    });
    const message = channel.messages.cache.find(m => m.embeds[0].footer.text === messageReaction.message.id);
    if (messageReaction.count >= noiceboardMinValue) {
        const messageText = `${emoji} ${messageReaction.count} ${messageReaction.message.channel}`;
        if (!message) {
            return channel.send(messageText, embedMsg);
        }
        message.edit(messageText, embedMsg);
    } else if (message) {
        message.delete();
    }
}

module.exports = checkNoiceBoard;