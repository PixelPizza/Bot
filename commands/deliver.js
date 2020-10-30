const { createEmbed, hasRole, sendEmbed, editEmbed } = require("../functions"); 
const { blue, red } = require('../colors.json'); 
const { deliverer } = require('../roles.json'); 
const { query } = require("../dbfunctions"); 

module.exports = { 
    name: "deliver", 
    description: "deliver an order", 
    aliases: ["del"], 
    args: true, 
    minArgs: 1, 
    maxArgs: 1, 
    usage: "<order id>", 
    cooldown: 0, 
    userType: "worker", 
    neededPerms: [], 
    pponly: false, 
    async execute(message, args, client) { 
        let embedMsg = createEmbed({ 
            color: red, 
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
        if (orderer.id === message.author.id) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You can't deliver your own order`
            }), message);
        } 
        let cook = "none"; 
        if (result.cookId) cook = client.guildMembers.get(result.cookId) ? client.users.cache.get(result.cookId).username : "Deleted Cook"; 
        let image = result.imageUrl; 
        let invite = "AW7z9qu"; 
        let guild = client.guilds.cache.get(result.guildId); 
        let channel = client.channels.cache.get(result.channelId) ?? guild.systemChannel; 
        channel.createInvite({ maxAge: 0, reason: "Delivering an order" }).then(guildInvite => { 
            deliveryMessage = deliveryMessage.replace("{chef}", cook).replace("{customer}", orderer).replace("{image}", image).replace("{invite}", invite); 
            message.author.send(deliveryMessage).then(() => { 
                message.author.send(`Don't send this link to the orderer!\n${guildInvite.url}`).then(() => { 
                    query("UPDATE `order` SET status = 'delivered', delivererId = ? WHERE orderId = ?", [message.author.id, args[0]]); 
                    query("UPDATE worker SET deliveries = deliveries + 1 WHERE workerId = ?", [message.author.id]);
                    orderer.send(editEmbed(embedMsg, {
                        color: blue,
                        title: `Confirmation`,
                        description: `Your order is now being delivered by ${message.author}`
                    })); 
                }); 
            }); 
        }); 
    } 
}