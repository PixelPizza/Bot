const { randomInt } = require("crypto");
const { Permissions } = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { createEmbed, hasRole, sendEmbed, editEmbed, isVip, setCooldown } = PixelPizza;
const { blue, red } = PixelPizza.colors; 
const { deliverer, ceo } = PixelPizza.roles; 
const { query, checkProDeliverer } = require("../dbfunctions"); 
const { orderCooldown, invite } = PixelPizza.config;

module.exports = {
    name: "deliver",
    description: "let the bot deliver an order",
    aliases: ["del"],
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<order id>",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        let embedMsg = createEmbed({ 
            color: red.hex, 
            title: "deliver" 
        }); 
        const deliverRole = client.guild.roles.cache.get(deliverer); 
        if (!hasRole(client.member, deliverer)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${deliverRole.name} role to be able to deliver`
            }), message);
        } 
        let results = await query("SELECT deliveryMessage FROM worker WHERE workerId = ?", [message.author.id]); 
        if (!results[0].deliveryMessage) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have not set a delivery message yet. please set one with ppdelset`
            }), message);
        }
        let result = results[0]; 
        let deliveryMessage = result.deliveryMessage; 
        results = await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'cooked'", [args[0]]); 
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the cooked status`
            }), message);
        }
        result = results[0]; 
        const orderer = client.users.cache.get(result.userId); 
        if(!hasRole(client.member, ceo)){
            if (!client.toggles.deliverOwnOrder && orderer.id === message.author.id) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: `You can't deliver your own order`
                }), message);
            } 
        }
        const member = client.guildMembers.get(orderer.id);
        let cook = "none"; 
        if (result.cookId) cook = client.guildMembers.get(result.cookId) ? client.users.cache.get(result.cookId) : "Deleted Cook"; 
        let image = result.imageUrl; 
        let guild = client.guilds.cache.get(result.guildId); 
        let channel = client.channels.cache.get(result.channelId) ?? guild.channels.cache.find(channel => channel.type == "text" && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)); 
        const orderDate = new Date(result.orderedAt);
        const cookDate = new Date(result.cookedAt);
        const deliverDate = new Date(Date.now());
        deliveryMessage = deliveryMessage
            .replace(/{chef}/g, typeof cook == "string" ? cook : `<@${cook.id}>`)
            .replace(/{customer}/g, `<@${orderer.id}>`)
            .replace(/{image}/g, image)
            .replace(/{invite}/g, invite)
            .replace(/{deliverer}/g, `<@${message.author.id}>`)
            .replace(/{orderID}/g, args[0]) 
            .replace(/{order}/g, result.order)
            .replace(/{price}/g, `${PixelPizza.config.currency}${randomInt(PixelPizza.config.minPrice, PixelPizza.config.maxPrice)}`)
            .replace(/{orderdate}/g, `${orderDate.getDate()}-${orderDate.getMonth()}-${orderDate.getFullYear()} (dd-mm-YYYY)`)
            .replace(/{cookdate}/g, `${cookDate.getDate()}-${cookDate.getMonth()}-${cookDate.getFullYear()} (dd-mm-YYYY)`)
            .replace(/{deliverydate}/g, `${deliverDate.getDate()}-${deliverDate.getMonth()}-${deliverDate.getFullYear()} (dd-mm-YYYY)`);
        deliveryMessage += `\n\n**Note:** I (owner of ${client.user.username}) have been told that discord can ban people for joining and leaving many servers at once\nso to make sure this can not happen (even if it is not true) we now let ${client.user.username} deliver almost all of the orders\nThank you for understanding`;
        try {
            channel.send(deliveryMessage);
        } catch (err) {
            orderer.send("Could not send order to the server it was ordered in, here is your order\n"+deliveryMessage);
            PixelPizza.error("Could not send order", err);
        }
        query("UPDATE `order` SET status = 'delivered', delivererId = ?, deliveredAt = CURRENT_TIMESTAMP WHERE orderId = ?", [message.author.id, args[0]]); 
        query("UPDATE worker SET deliveries = deliveries + 1 WHERE workerId = ?", [message.author.id]);
        if(!member || !isVip(member)) setCooldown(client, "order", orderer.id, orderCooldown);
        checkProDeliverer(client.guildMembers.get(message.author.id));
        sendEmbed(editEmbed(embedMsg, {
            color: PixelPizza.colors.green.hex,
            description: "Order has been delivered"
        }), message);
    }
}