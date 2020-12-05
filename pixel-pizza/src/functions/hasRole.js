'use strict';

const discord = require("discord.js");

/**
 * A sorter version of checking if a member has a role
 * @param {discord.GuildMember} member The member to check
 * @param {discord.RoleResolvable} role The role to check
 * @returns {boolean} True if the user has the role, otherwise false
 */
const hasRole = (member, role) => member.roles.cache.has(role);

module.exports = hasRole;