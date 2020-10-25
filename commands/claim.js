const { createEmbed, hasRole, sendEmbed, sendEmbedWithChannel, editEmbed, wait } = require("../functions");
const { blue, red, gray, green } = require('../colors.json');
const { cook } = require('../roles.json');
const { text } = require('../channels.json');
const { query } = require("../dbfunctions");

module.exports = {
    name: "claim",
    description: "claim an order as cook",
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<order id>",
    cooldown: 0,
    userType: "worker",
    pponly: false,
    async execute(message, args, client) {
        let embedMsg = createEmbed({
            color: red,
            title: `**${this.name}**`
        });
        const cookRole = client.guild.roles.cache.get(cook);
        if (!hasRole(client.member, cook)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${cookRole.name} role in ${client.guild.name} to be able to claim an order`
            }), message);
        }
        let results = await query(
            "SELECT * \
            FROM `order` \
            WHERE orderId = ? AND status = 'not claimed'",
            [args[0]]
        );
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the not claimed status`
            }), message);
        }
        if (message.author.id == results[0].userId) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You can't claim your own order"
            }), message);
        }
        const user = client.users.cache.get(results[0].userId);
        query("UPDATE `order` SET cookId = ?, status = 'claimed' WHERE orderId = ?", [message.author.id, args[0]]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `You have claimed order ${args[0]}`
        }), message);
        user.send(editEmbed(embedMsg, {
            color: blue,
            title: "**confirmation**",
            description: `Your order has been claimed by <@${message.author.id}>`
        }));
        await wait(600000);
        results = await query("SELECT status FROM `order` WHERE orderId = ?", [args[0]]);
        if (!results.length) return;
        if (results[0].status == "claimed") {
            query("UPDATE `order` SET cookId = NULL, status = 'not claimed' WHERE orderId = ?", [args[0]]);
            sendEmbedWithChannel(editEmbed(embedMsg, {
                color: gray,
                title: "**claim canceled**",
                description: `Order ${args[0]} has been declaimed because the cook took to long to cook the order`
            }), client, client.channels.cache.get(text.kitchen));
            user.send(editEmbed(embedMsg, {
                color: blue,
                title: "**confirmation**",
                description: `Your order has been declaimed bacuase the cook took to long to cook the order`
            }));
        }
    }
}