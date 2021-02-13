const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { query } = require('../dbfunctions'); 
const { createEmbed, sendEmbed, editEmbed, capitalize, timestampToDate } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 

module.exports = { 
    name: "look", 
    description: "look at an order by order id", 
    aliases: ["show"], 
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
     * @returns {Promise<void>}
     */
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const results = await query("SELECT * FROM `order` WHERE orderId = ?", [args[0]]); 
        if (!results.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The order with order id ${args[0]} does not exist`
            }), client, message);
        } 
        const result = results[0];
        let orderer = client.users.cache.get(result.userId);
        orderer = orderer ? `**Username**\n${orderer.username}\n**Tag**\n${orderer.tag}\n**Id**\n${orderer.id}` : "Unknown orderer";
        const guild = client.guilds.cache.get(result.guildId);
        const channel = guild?.channels.cache.get(result.channelId);
        const orderDate = result.orderedAt;
        const cookDate = result.cookedAt;
        const deliverDate = result.deliveredAt;
        let cook = "none";
        if (result.cookId) cook = client.guildMembers.get(result.cookId) ? client.users.cache.get(result.cookId).username : "Deleted Cook"; 
        let deliverer = "none"; 
        if (result.delivererId) deliverer = client.guildMembers.get(result.delivererId) ? client.users.cache.get(result.delivererId).username : "Deleted Deliverer"; 
        embedMsg = editEmbed(embedMsg, {
            color: blue.hex,
            title: "**Order**",
            description: `***${result.order}***`,
            fields: [
                {
                    name: "\u200b",
                    value: "\u200b"
                },
                { 
                    name: "Orderer", 
                    value: orderer 
                },
                { 
                    name: "Guild name", 
                    value: guild?.name || "Unknown guild", 
                    inline: true 
                }, 
                { 
                    name: "Ordered in channel", 
                    value: channel?.name || "Unknown channel", 
                    inline: true 
                },
                {
                    name: "\u200b",
                    value: "\u200b"
                },
                { 
                    name: "Ordered at", 
                    value: orderDate ? timestampToDate(orderDate) : "Unknown"
                },
                {
                    name: "Cooked at",
                    value: cookDate ? timestampToDate(cookDate) : "Unknown"
                },
                {
                    name: "Delivered at",
                    value: deliverDate ? timestampToDate(deliverDate) : "Unknown"
                },
                {
                    name: "\u200b",
                    value: "\u200b"
                }
            ],
            footer: {
                text: `id: ${result.orderId} | status: ${result.status} | method: ${result.deliveryMethod} | cook: ${cook} | deliverer: ${deliverer}`
            },
            image: result.imageUrl
        });
        if (!client.canSendEmbeds) embedMsg = `${embedMsg.description}\n\n${embedMsg.fields[1].name}\n${embedMsg.fields[1].value}\n${embedMsg.fields[2].name}\n${embedMsg.fields[2].value}\n${embedMsg.fields[3].name}\n${embedMsg.fields[3].value}\n${embedMsg.footer.text}`; 
        message.channel.send(embedMsg);
    } 
}
