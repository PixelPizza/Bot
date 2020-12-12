'use strict';

const { Guild } = require("discord.js");
const PPClient = require("../../classes/PPClient");

/**
 * Get a guild by arguments
 * @param {string[]} args The arguments used as guild name
 * @param {PPClient} client The client to get the guild from
 * @returns {Guild} Returns the found guild if there is one
 */
const getGuild = (args, client) => client.guilds.cache.find(guild => guild.id == args.join(" ") || guild.name.toLowerCase().includes(args.join(" ").toLowerCase()));

module.exports = getGuild;