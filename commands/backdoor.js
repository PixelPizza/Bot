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
        const embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const guild = getGuild(args, client);
        if(!guild){
            return sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: 'Could not find guild, please be more specific'
            }), client, message);
        }
        const channel = guild.channels.cache.find(channel => channel.type == "text" && channel.permissionsFor(guild.me).has(discord.Permissions.FLAGS.CREATE_INSTANT_INVITE));
        if(!channel){
            return sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: `Could not create invite for ${guild.name}`
            }), client, message);
        }
        message.channel.send((await channel.createInvite({ maxAge: 0, maxUses: 1 })).url);
    }
}