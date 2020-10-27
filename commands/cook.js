const { MessageAttachment } = require('discord.js');
const { createEmbed, hasRole, sendEmbed, sendEmbedWithChannel, isImage, editEmbed, randomInt, wait } = require("../functions");
const { blue, red } = require('../colors.json');
const { cook } = require('../roles.json');
const { query } = require("../dbfunctions");
const { text } = require('../channels.json');

module.exports = {
    name: "cook",
    description: "cook an order",
    args: true,
    minArgs: 1,
    maxArgs: 2,
    usage: "<order id> <image | image link>",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    async execute(message, args, client) {
        let embedMsg = createEmbed({
            color: red,
            title: `**${this.name}**`
        });
        const cookRole = client.guild.roles.cache.get(cook);
        if (!hasRole(client.member, cook)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${cookRole.name} role in ${client.guild.name} to be able to cook an order`
            }), message);
        }
        if (message.attachments.array().length > 1) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `There are too many attachments! please send only one image with the message!`
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
                description: `This order has already been claimed by someone else`
            }), message);
        }
        let url = message.attachments.first()?.url || args[1];
        if (!isImage(url)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This link is invalid`
            }), message);
        }
        client.channels.cache.get(text.images).send(new MessageAttachment(url)).then(async msg => {
            query(
                "UPDATE `order` \
                SET imageUrl = ?, status = 'cooking' \
                WHERE orderId = ?",
                [msg.attachments.first().url, args[0]]
            );
            const cookTime = randomInt(60, 480);
            embedMsg.setDescription(`The order is cooking for ${Math.floor(cookTime / 60)}m${cookTime % 60}s`);
            const confirmation = createEmbed({
                color: blue,
                title: 'confirmation',
                description: 'Your order is now being cooked'
            });
            const user = client.users.cache.get(results[0].userId);
            user.send(confirmation);
            sendEmbed(embedMsg, message);
            await wait(cookTime * 1000);
            query("UPDATE `order` SET status = 'cooked' WHERE orderId = ?", [args[0]]);
            query("UPDATE worker SET cooks = cooks + 1 WHERE workerId = ?", [message.author.id]);
            sendEmbedWithChannel(editEmbed(embedMsg, {
                description: `Order ${args[0]} is done cooking`
            }), client, client.channels.cache.get(text.delivery));
            user.send(editEmbed(confirmation, {
                description: `Your order has been cooked`
            }));
        });
    }
}