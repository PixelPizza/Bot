const { query } = require("../dbfunctions");
const { sendEmbed, createEmbed, editEmbed, capitalize } = require("../functions");
const { blue, red } = require('../colors.json'); 

module.exports = {
    name: "pizza",
    description: "show a random delivered pizza",
    args: false,
    cooldown: 300,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const orders = await query("SELECT * FROM `order` WHERE status = 'delivered' ORDER BY RAND() LIMIT 1");
        if(!orders.length){
            return sendEmbed(createEmbed({
                color: red,
                title: "Order not found",
                description: "Could not find any delivered orders"
            }), message);
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
            color: blue,
            description: `*${order.order}*`,
            fields: [
                { name: "Orderer", value: orderer }, 
                { name: "Guild name", value: guild.name, inline: true }, 
                { name: "Ordered in channel", value: channel.name, inline: true },
            ],
            footer: {
                text: `id: ${order.orderId} | status: ${order.status} | cook: ${cook} | deliverer: ${deliverer}`
            },
            image: order.imageUrl
        });
        if (!client.canSendEmbeds) embedMsg = `${embedMsg.description}\n${embedMsg.fields[0].name}\n${embedMsg.fields[0].value}\n${embedMsg.fields[1].name}\n${embedMsg.fields[1].value}\n${embedMsg.fields[2].name}\n${embedMsg.fields[2].value}\n${embedMsg.footer.text}`; 
        message.channel.send(embedMsg); 
    }
}