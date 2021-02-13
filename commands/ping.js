const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { sendEmbed, createEmbed } = PixelPizza;
const { blue } = PixelPizza.colors;

module.exports = {
    name: "ping",
    description: "ping the bot",
    args: false,
    cooldown: 60,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        sendEmbed(createEmbed({
            color: blue.hex,
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
        }), client, message);
    }
}