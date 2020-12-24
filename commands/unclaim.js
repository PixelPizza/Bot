const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, hasRole, editEmbed, capitalize, error } = PixelPizza; 
const { query } = require('../dbfunctions'); 
const { cook } = PixelPizza.roles; 
const { red, blue, green } = PixelPizza.colors; 

module.exports = { 
    name: "unclaim", 
    description: "unclaim a claimed order", 
    args: true, 
    minArgs: 1, 
    maxArgs: 1, 
    usage: "<order id>", 
    cooldown: 0, 
    userType: "worker", 
    neededPerms: [], 
    pponly: false, 
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client
     * @param {{
     *  worker: boolean,
     *  teacher: boolean,
     *  staff: boolean,
     *  director: boolean,
     *  botguildMember: discord.GuildMember
     * }} options 
     * @returns {Promise<void>}
     */
    async execute(message, args, client, options) { 
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const cookRole = client.guild.roles.cache.get(cook); 
        if (!hasRole(options.botguildMember, cook)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have te ${cookRole.name} role in ${client.guild.name} to be able to unclaim an order`
            }), client, message);
        } 
        let results = await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'claimed'", [args[0]]); 
        if (!results.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the claimed status`
            }), client, message);
        } 
        if (results[0].cookId != message.author.id) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `Only the cook that claimed the order can unclaim the order`
            }), client, message);
        } 
        const user = client.users.cache.get(results[0].userId); 
        query("UPDATE `order` SET cookId = NULL, status = 'not claimed' WHERE orderId = ?", [args[0]]).then(() => { 
            sendEmbed(editEmbed(embedMsg, {
                color: green.hex,
                description: `You have unclaimed order ${args[0]}`
            }), client, message); 
            user.send(editEmbed(embedMsg, {
                color: blue.hex,
                title: "Confirmation",
                description: `Your order has been unclaimed by the cook who claimed it`
            })).catch(err => error(`Could not send confirmation to ${message.author.tag}`, err)); 
        }); 
    } 
}