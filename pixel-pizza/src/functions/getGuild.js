'use strict';

const getGuild = (args, client) => client.guilds.cache.find(guild => guild.id == args.join(" ") || guild.name.toLowerCase().includes(args.join(" ").toLowerCase()));

module.exports = getGuild;