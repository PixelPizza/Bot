const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { query } = require("../dbfunctions");
const { sendEmbed, createEmbed } = PixelPizza;
const { blue, red } = PixelPizza.colors; 

module.exports = {
    name: "randomorder",
    description: "show a random delivered order",
    aliases: ["randorder", "ro"],
    args: false,
    cooldown: 10,
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
        const orders = await query("SELECT * FROM `order` WHERE status = 'delivered' ORDER BY RAND() LIMIT 1");
        if(!orders.length){
            return sendEmbed(createEmbed({
                color: red.hex,
                title: "Order not found",
                description: "Could not find any delivered orders"
            }), client, message);
        }
        const order = orders[0];
        const orderer = client.users.cache.get(order.userId)?.username || "Unknown orderer"; 
        const guild = client.guilds.cache.get(order.guildId); 
        const channel = guild.channels.cache.get(order.channelId); 
        channel.name = channel ? channel.name : "Deleted Channel"; 
        let cook = "none"; 
        if (order.cookId) cook = client.guildMembers.get(order.cookId) ? client.users.cache.get(order.cookId).username : "Deleted Cook"; 
        let deliverer = "none"; 
        if (order.delivererId) deliverer = client.guildMembers.get(order.delivererId) ? client.users.cache.get(order.delivererId).username : "Deleted Deliverer"; 
        let embedMsg = createEmbed({
            title: `**Order**`,
            color: blue.hex,
            description: `*${order.order}*`,
            fields: [
                { name: "Orderer", value: orderer }, 
                { name: "Guild name", value: guild.name, inline: true }, 
                { name: "Ordered in channel", value: channel.name, inline: true },
            ],
            footer: {
                text: `id: ${order.orderId} | cook: ${cook} | deliverer: ${deliverer}`
            },
            image: order.imageUrl
        });
        if (!client.canSendEmbeds) embedMsg = `${embedMsg.description}\n${embedMsg.fields[0].name}\n${embedMsg.fields[0].value}\n${embedMsg.fields[1].name}\n${embedMsg.fields[1].value}\n${embedMsg.fields[2].name}\n${embedMsg.fields[2].value}\n${embedMsg.footer.text}`; 
        message.channel.send(embedMsg); 
    }
}
