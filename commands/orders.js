const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, editEmbed, capitalize } = PixelPizza; 
const { query } = require("../dbfunctions"); 
const { blue, red } = PixelPizza.colors; 
const { statuses } = PixelPizza.config;

module.exports = { 
    name: "orders", 
    description: "show all orders", 
    minArgs: 0, 
    usage: "<status>", 
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
        const status = args?.join(" ");
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        let results; 
        if (!args.length) { 
            results = await query("SELECT orderId FROM `order` WHERE status NOT IN('deleted','delivered')"); 
        } else if (!statuses.orders.includes(status)) { 
            embedMsg = editEmbed(embedMsg, {
                description: `${status} is not a valid status`,
                fields: [
                    {name: "Statuses", value: statuses.orders.join(", ")}
                ]
            });
            if (!client.canSendEmbeds) embedMsg = `${embedMsg.description}\n\n${embedMsg.fields[0].name}\n${embedMsg.fields[0].value}`; 
            return message.channel.send(embedMsg); 
        } else { 
            results = await query("SELECT orderId FROM `order` WHERE status = ?", [status]); 
        } 
        let ordersString = results.length ? "`" : "no orders have been found"; 
        for (let i in results) { 
            let result = results[i]; 
            ordersString += result.orderId; 
            if (i == results.length - 1) { 
                ordersString += "`"; 
            } else { 
                ordersString += ", "; 
            } 
        } 
        sendEmbed(editEmbed(embedMsg, {
            color: blue.hex,
            description: ordersString
        }), client, message); 
    } 
}