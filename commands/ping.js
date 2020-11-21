const { sendEmbed, createEmbed, capitalize } = require("../functions");
const { blue } = require('../colors.json');

module.exports = {
    name: "ping",
    description: "ping the bot",
    args: false,
    cooldown: 60,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        sendEmbed(createEmbed({
            color: blue,
            fields: [
                {
                    name: "Message Latency",
                    value: `${Date.now() - message.createdTimestamp}ms`
                },
                {
                    name: "Bot Latency",
                    value: `${Math.round(client.ws.ping)}ms`
                }
            ]
        }), message);
    }
}