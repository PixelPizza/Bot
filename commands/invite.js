const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const {FLAGS} = discord.Permissions;
const { sendEmbed, createEmbed, capitalize } = PixelPizza;
const { blue } = PixelPizza.colors;

module.exports = {
    name: "invite",
    description: "invite the bot",
    args: false,
    cooldown: 0,
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
        const permInt = FLAGS.CREATE_INSTANT_INVITE | FLAGS.SEND_MESSAGES | FLAGS.EMBED_LINKS;
        sendEmbed(createEmbed({
            color: blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: `Here is the invite link for ${client.user.username}!\nhttps://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${permInt}&scope=bot`
        }), client, message);
    }
}