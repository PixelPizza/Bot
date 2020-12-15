'use strict';

const {prefix} = require("../../data/config");

/**
 * Update the amount of guilds in Pixel Pizza
 * @param {PPClient} client The client to get the members and channels from
 * @returns {void}
 */
const updateGuildAmount = (client) => {
    let serverAmount = client.guilds.cache.array().length;
    let suffixUsed = "";
    for (let suffix in ["k", "m", "b"]) {
        if (serverAmount > 1000) {
            serverAmount /= 1000;
            suffixUsed = suffix;
        } else break;
    }
    serverAmount = "with " + serverAmount + suffixUsed;
    client.user.setActivity(`${serverAmount} guilds | ${prefix}help`, { type: "STREAMING", url: "http://twitch.tv/PixelPizzaServer" });
}

module.exports = updateGuildAmount;