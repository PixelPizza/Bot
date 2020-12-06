const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { text } = PixelPizza.channels;
const { blue } = PixelPizza.colors;
const { sendEmbed, createEmbed } = PixelPizza;

module.exports = {
    name: "support",
    description: "get the invite link to pixel pizza",
    args: false,
    cooldown: 30,
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
        const channel = client.guild.channels.cache.get(text.restaurant);
        const invite = await channel.createInvite({maxAge: 0, maxUses: 0, unique: false});
        sendEmbed(createEmbed({
            color: blue.hex,
            title: "**Invite link**",
            description: invite.url
        }), client, message);
    }
}