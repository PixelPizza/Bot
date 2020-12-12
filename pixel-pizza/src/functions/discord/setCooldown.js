'use strict';

const discord = require("discord.js");
const PPClient = require("../../classes/PPClient");

/**
 * Set a cooldown for a command for a user
 * @param {PPClient} client The client to get the cooldowns from
 * @param {string} commandName The name of the command
 * @param {discord.Snowflake} userId The id of the user
 * @param {number} seconds The amount of seconds the cooldown lasts
 * @returns {void}
 */
const setCooldown = (client, commandName, userId, seconds) => {
    if (!client.cooldowns.has(commandName)) {
        client.cooldowns.set(commandName, new discord.Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(commandName);
    const ms = seconds * 1000;
    if (!timestamps.has(userId) || now >= timestamps.get(userId) + ms){
        timestamps.set(userId, now + ms);
        setTimeout(() => timestamps.delete(userId), ms);
    }
}

module.exports = setCooldown;