'use strict';

const inBotGuild = (client, userId) => client.guildMembers.has(userId);

module.exports = inBotGuild;