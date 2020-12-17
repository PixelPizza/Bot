'use strict';

const {prefix} = require("../../data/config");
const PPClient = require('../../classes/PPClient');

/**
 * Update the amount of guilds in Pixel Pizza
 * @param {PPClient} client The client to get the members and channels from
 * @returns {void}
 */
const updateGuildAmount = (client) => {
    const opts = { type: "STREAMING", url: "http://twitch.tv/PixelPizzaServer" };
    client.user.setActivity(`${prefix}help`, opts);
    let message = 0;
    setInterval(() => {
        let serverAmount = client.guilds.cache.array().length;
        let suffixUsed = "";
        for (let suffix in ["k", "m", "b"]) {
            if (serverAmount > 1000) {
                serverAmount /= 1000;
                suffixUsed = suffix;
            } else break;
        }
        const messages = [`${serverAmount}${suffixUsed} guilds`, `v1.1`, `${prefix}help`];
        client.user.setActivity(messages[message], opts);
        message = message == messages.length - 1 ? 0 : message + 1;
    }, 30000);
}

module.exports = updateGuildAmount;