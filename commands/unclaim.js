const { createEmbed, sendEmbed, hasRole, editEmbed, capitalize } = require('../functions'); 
const { query } = require('../dbfunctions'); 
const { cook } = require('../roles.json'); 
const { red, blue, green } = require('../colors.json'); 
const { error } = require('../consolefunctions');

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
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        const cookRole = client.guild.roles.cache.get(cook); 
        if (!hasRole(client, client.member, cook)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have te ${cookRole.name} role in ${client.guild.name} to be able to unclaim an order`
            }), message);
        } 
        let results = await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'claimed'", [args[0]]); 
        if (!results.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the claimed status`
            }), message);
        } 
        if (results[0].cookId != message.author.id) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `Only the cook that claimed the order can unclaim the order`
            }), message);
        } 
        const user = client.users.cache.get(results[0].userId); 
        query("UPDATE `order` SET cookId = NULL, status = 'not claimed' WHERE orderId = ?", [args[0]]).then(() => { 
            sendEmbed(editEmbed(embedMsg, {
                color: green,
                description: `You have unclaimed order ${args[0]}`
            }), message); 
            user.send(editEmbed(embedMsg, {
                color: blue,
                title: "Confirmation",
                description: `Your order has been unclaimed by the cook who claimed it`
            })).catch(err => error(`Could not send confirmation to ${message.author.tag}`, err)); 
        }); 
    } 
}