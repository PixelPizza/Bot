'use strict';

const discord = require('discord.js');

/**
 * Remove a role from a discord member
 * @param {discord.GuildMember} member The discord member to remove the role from
 * @param {discord.RoleResolvable} role The discord role to remove from the member
 * @returns {Promise<discord.GuildMember>} A promise with the member that the role was removed from
 */
const removeRole = (member, role) => member.roles.remove(role);

module.exports = removeRole;