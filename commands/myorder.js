const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, editEmbed } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
const { query } = require("../dbfunctions"); 
const { prefix } = PixelPizza.config; 

module.exports = { 
    name: "myorder", 
    description: "see your current order", 
    args: false, 
    cooldown: 0, 
    userType: "all", 
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
            title: "**order**",
            description: `You have not ordered anything use ${prefix}order to order something`
        });
        let result = await query("SELECT * FROM `order` WHERE userId = ? AND status NOT IN('deleted','delivered')", [message.author.id]); 
        if (!result.length) return sendEmbed(embedMsg, client, message); 
        const guild = client.guilds.cache.get(result[0].guildId); 
        const channel = guild.channels.cache.get(result[0].channelId); 
        channel.name = channel ? channel.name : "Deleted Channel"; 
        let cook = "none"; 
        if (result[0].cookId) { 
            cook = client.guildMembers.get(result[0].cookId) ? client.users.cache.get(result[0].cookId).username : "Deleted Cook"; 
        } 
        let deliverer = "none"; 
        if (result[0].delivererId) { 
            deliverer = client.guildMembers.get(result[0].delivererId) ? client.users.cache.get(result[0].delivererId).username : "Deleted Deliverer"; 
        } 
        embedMsg = editEmbed(embedMsg, {
            color: blue.hex,
            description: `***${result[0].order}***`,
            fields: [
                { name: "Orderer", value: message.author.tag }, 
                { name: "Guild", value: guild.name, inline: true }, 
                { name: "Ordered in channel", value: channel.name, inline: true }
            ],
            footer: {
                text: `id: ${result[0].orderId} | status: ${result[0].status} | cook: ${cook} | deliverer: ${deliverer}`
            }
        });
        if (!client.canSendEmbeds) embedMsg = `${embedMsg.description}\n${embedMsg.fields[0].name}\n\`${embedMsg.fields[0].value}\`\n${embedMsg.fields[1].name}\n\`${embedMsg.fields[1].value}\`\n${embedMsg.fields[2].name}\n${embedMsg.fields[2].value}\n\`${embedMsg.footer.text}\``; 
        message.channel.send(embedMsg); 
    } 
}