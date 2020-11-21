const {Permissions} = require('discord.js');
const { sendEmbed, createEmbed, capitalize } = require('../functions');
const { blue } = require('../colors.json');
const FLAGS = Permissions.FLAGS;

module.exports = {
    name: "invite",
    description: "invite the bot",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const permInt = FLAGS.CREATE_INSTANT_INVITE | FLAGS.SEND_MESSAGES | FLAGS.EMBED_LINKS;
        sendEmbed(createEmbed({
            color: blue,
            title: `**${capitalize(this.name)}**`,
            description: `Here is the invite link for ${client.user.username}!\nhttps://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${permInt}&scope=bot`
        }), message);
    }
}