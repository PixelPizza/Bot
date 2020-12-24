const { randomInt } = require("crypto");
const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, hasRole, sendEmbed, editEmbed, isVip, setCooldown } = PixelPizza;
const { green, red } = PixelPizza.colors; 
const { deliverer, ceo } = PixelPizza.roles; 
const { query, checkProDeliverer } = require("../dbfunctions"); 
const { orderCooldown } = PixelPizza.config;

module.exports = {
    name: "deliverdm",
    description: "deliver an order to the dm of the orderer (pixel pizza will deliver it for you)",
    aliases: ["deldm"],
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<order id>",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    removeExp: false,
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
            title: "deliver" 
        }); 
        const deliverRole = client.guild.roles.cache.get(deliverer); 
        if (!hasRole(options.botguildMember, deliverer)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${deliverRole.name} role to be able to deliver`
            }), client, message);
        } 
        let results = await query("SELECT deliveryMessage FROM worker WHERE workerId = ?", [message.author.id]); 
        if (!results[0].deliveryMessage) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have not set a delivery message yet. please set one with ppdelset`
            }), client, message);
        } 
        let result = results[0]; 
        let deliveryMessage = result.deliveryMessage; 
        results = await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'cooked'", [args[0]]); 
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the cooked status`
            }), client, message);
        } 
        result = results[0]; 
        const orderer = client.users.cache.get(result.userId); 
        if(!hasRole(options.botguildMember, ceo)){
            if (!client.toggles.deliverOwnOrder && orderer.id === message.author.id) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: `You can't deliver your own order`
                }), client, message);
            } 
        }
        const member = client.guildMembers.get(orderer.id);
        let cook = "none"; 
        if (result.cookId) cook = client.guildMembers.get(result.cookId) ? client.users.cache.get(result.cookId).username : "Deleted Cook"; 
        let image = result.imageUrl; 
        deliveryMessage = await PixelPizza.parseMessage(client, deliveryMessage, cook, orderer, image, message.author, args[0], result.order, result.orderedAt, result.cookedAt, Date.now(), "DM", "DM");
        orderer.send(deliveryMessage).then(() => {
            query("UPDATE `order` SET status = 'delivered', deliveryMethod = 'dm', delivererId = ?, deliveredAt = CURRENT_TIMESTAMP WHERE orderId = ?", [message.author.id, args[0]]); 
            query("UPDATE worker SET deliveries = deliveries + 1 WHERE workerId = ?", [message.author.id]);
            if(!member || !isVip(member)) setCooldown(client, "order", orderer.id, orderCooldown);
            sendEmbed(createEmbed({
                color: green.hex,
                title: '**Delivered**',
                description: 'The order has been delivered'
            }), client, message);
            checkProDeliverer(client.guildMembers.get(message.author.id));
        });
    }
}