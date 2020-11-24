'use strict';

const setCooldown = (client, commandName, userId, seconds) => {
    if (!client.cooldowns.has(commandName)) {
        client.cooldowns.set(commandName, new Collection());
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