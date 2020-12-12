'use strict';

const PPClient = require('../../classes/PPClient');
const discord = require('discord.js');

/**
 * Check if a user is in the main guild of the bot
 * @param {PPClient} client The client to check the members from
 * @param {discord.Snowflake} userId The id of the user to check
 * @returns {boolean} if the user is in the main guild of the bot 
 */
const inBotGuild = (client, userId) => client.guildMembers.has(userId);

module.exports = inBotGuild;