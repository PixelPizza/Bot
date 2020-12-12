'use strict';

const {prefix} = require("../../data/config");

/**
 * Update the amount of guilds in Pixel Pizza
 * @param {PPClient} client The client to get the members and channels from
 * @returns {void}
 */
const updateGuildAmount = (client) => {
    const activities = ["PLAYING", "STREAMING", "LISTENING", "WATCHING"];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    let serverAmount = client.guilds.cache.array().length;
    let suffixUsed = "";
    for (let suffix in ["k", "m", "b"]) {
        if (serverAmount > 1000) {
            serverAmount /= 1000;
            suffixUsed = suffix;
        } else break;
    }
    serverAmount = serverAmount + suffixUsed;
    serverAmount = activity == "PLAYING" || activity == "STREAMING" ? `with ${serverAmount}` : serverAmount;
    client.user.setActivity(`${serverAmount} guilds | ${prefix}help`, { type: activity, url: "http://twitch.tv/" });
}

module.exports = updateGuildAmount;