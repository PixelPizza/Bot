'use strict';

const {voice} = require("../../data/channels");

/**
 * Update the amount of members in Pixel Pizza
 * @param {PPClient} client The client to get the members and channels from
 * @returns {void}
 */
const updateMemberSize = (client) => {
    const [bots, members] = client.guildMembers.partition(member => member.user.bot);
    client.channels.cache.get(voice.allMembers).setName(`All members: ${client.guildMembers.size}`);
    client.channels.cache.get(voice.members).setName(`Members: ${members.size}`);
    client.channels.cache.get(voice.bots).setName(`Bots: ${bots.size}`);
}

module.exports = updateMemberSize;