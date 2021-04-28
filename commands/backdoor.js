const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, getGuild, sendEmbed, capitalize } = PixelPizza;
const { red } = PixelPizza.colors;

module.exports = {
    name: "backdoor",
    description: "get invite link of a guild by order (this is used for if the invite is lost or has been expired)",
    args: true,
    minArgs: 1,
    usage: "<order id>",
    cooldown: 0,
    userType: "worker",
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
        const orders = await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'delivered' AND deliveryMethod = 'personal' AND delivererId = ?", [args[0], message.author.id]);
        if(!orders.length){
            return sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: "Could not find an order that was delivered personally by you with that id"
            }), client, message);
        }
        const order = orders[0];
        const guild = client.guilds.cache.get(order.guildId);
        if(!guild){
            return sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: 'Could not find guild'
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