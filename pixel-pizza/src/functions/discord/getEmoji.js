'use strict';

const { Guild, Emoji } = require('discord.js');

/**
 * Get an emoji from a guild
 * @param {Guild} guild The guild to get the emoji from
 * @param {string} emoji The id of the emoji
 * @returns {string | Emoji} Returns the emoji if it is from the guild and the string otherwise
 */
const getEmoji = (guild, emoji) => guild.emojis.cache.has(emoji) ? guild.emojis.cache.get(emoji) : emoji;

module.exports = getEmoji;