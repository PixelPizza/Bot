const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, getGuild, sendEmbed, capitalize } = PixelPizza;
const { red } = PixelPizza.colors;

module.exports = {
    name: "backdoor",
    description: "get invite link of a guild (this is used for if the invite is lost or has been expired)",
    args: true,
    minArgs: 1,
    usage: "<guild>",
    cooldown: 0,
    userType: "staff",
    neededPerms: ["CREATE_INSTANT_INVITE"],
    pponly: true,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const guild = getGuild(args, client);
        if(!guild){
            return sendEmbed(createEmbed({
                color: red.hex,
                title: `**${capitalize(this.name)}**`,
                description: 'Could not find guild, please be more specific'
            }), client, message);
        }
        message.channel.send((await guild.channels.cache.find(channel => channel.type == "text").createInvite({ maxAge: 0, maxUses: 1 })).url);
    }
}