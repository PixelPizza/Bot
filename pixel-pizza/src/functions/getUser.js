'use strict';

const getUser = (message, args, client) => (message.mentions.users.first() || client.users.cache.find(user => user.id == args[0] || user.username.toLowerCase().includes(args.join(" ").toLowerCase()))) || client.guildMembers.find(member => member.displayName.toLowerCase().includes(args.join(" ").toLowerCase()))?.user;

module.exports = getUser;