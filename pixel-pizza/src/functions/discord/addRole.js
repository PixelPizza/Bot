'use strict';

const discord = require('discord.js');

/**
 * Add a role to a discord member
 * @param {discord.GuildMember} member The discord member to add the role to
 * @param {discord.RoleResolvable} role The discord role to add to the member
 * @returns {Promise<discord.GuildMember>} A promise with the member that the role was added to
 */
const addRole = (member, role) => member.roles.add(role);

module.exports = addRole;