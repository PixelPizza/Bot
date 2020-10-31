const { createEmbed, hasRole, sendEmbed, editEmbed, capitalize } = require("../functions"); 
const { query, makeOrderId } = require("../dbfunctions"); 
const { blue, red, green } = require('../colors.json'); 
const { maxPizzas } = require('../config.json'); 
const { levelRoles, cook } = require('../roles.json'); 
const { text } = require('../channels.json'); 

module.exports = { 
    name: "order", 
    description: "order a pizza", 
    args: true, 
    minArgs: 1, 
    usage: "<order>", 
    cooldown: 0, 
    userType: "all", 
    neededPerms: ["CREATE_INSTANT_INVITE"], 
    pponly: false, 
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`,
            description: "Your pizza has been ordered and will be cooked as soon as possible"
        });
        let result = await query("SELECT COUNT(*) as counted FROM `order`"); 
        if (result[0].counted >= maxPizzas && !hasRole(client.member, levelRoles.hundered)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The maximum pizza amount has been reached! please try again later`
            }), message);
        } 
        const order = args.join(" "); 
        if (!order.toLowerCase().includes("pizza")) { 
            return sendEmbed(editEmbed(embedMsg, {
                title: `error`,
                description: "The order has to include the word pizza!"
            }), message);
        } 
        result = await query("SELECT * FROM `order` WHERE userId = ? AND status NOT IN('delivered','deleted')", [message.author.id]); 
        if (result.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have already ordered pizza. please wait until your order has arrived`
            }), message);
        } 
        const id = await makeOrderId(); 
        await query("INSERT INTO `order`(orderId,userId,guildId,channelId,status,`order`) VALUES(?,?,?,?,'not claimed',?)", [id, message.author.id, message.guild.id, message.channel.id, order]); 
        const embedMsgOrder = createEmbed({
            color: blue,
            title: `**${capitalize(this.name)}**`,
            description: `a new order has come in!`,
            timestamp: true,
            footer: {
                text: `id: ${id}`
            }
        });
        const channel = client.channels.cache.get(text.kitchen); 
        if (!client.canSendEmbeds) embedMsgOrder = embedMsgOrder.description + `\nId: ${id}`; 
        channel.send(`<@&${cook}>`, embedMsgOrder);
        message.channel.send(editEmbed(embedMsg, {color: green})); 
    } 
}