'use strict';

const { Message } = require("discord.js");
const PPClient = require('../../classes/PPClient');

/**
 * Get a user by message mentions and arguments
 * @param {Message} message The message to get mentions from
 * @param {string[]} args The arugments used as username or user id
 * @param {PPClient} client The client to get the user from
 */
const getUser = (message, args, client) => (message.mentions.users.first() || client.users.cache.find(user => user.id == args[0] || user.username.toLowerCase().includes(args.join(" ").toLowerCase()))) || client.guildMembers.find(member => member.displayName.toLowerCase().includes(args.join(" ").toLowerCase()))?.user;

module.exports = getUser;