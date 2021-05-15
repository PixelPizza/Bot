'use strict';

const hasRole = require("./hasRole");
const {vip} = require("../../data/roles");
const { GuildMember } = require("discord.js");

/**
 * Check if a member has the vip role
 * @param {GuildMember} member The member to check from
 * @returns {boolean} If the user has the vip role
 */
const isVip = (member) => hasRole(member, vip);

module.exports = isVip;