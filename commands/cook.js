const { MessageAttachment } = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { createEmbed, hasRole, sendEmbed, sendEmbedWithChannel, isImage, editEmbed, randomInt, wait, capitalize } = PixelPizza;
const { blue, red, silver } = PixelPizza.colors;
const { cook, pings } = PixelPizza.roles;
const { query, checkProChef } = require("../dbfunctions");
const { text } = PixelPizza.channels;

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
    getTimeAsString(time){
        let minutes = Math.floor(time / 60);
        minutes = minutes >= 10 ? minutes.toString() : `0${minutes.toString()}`;
        let seconds = time % 60;
        seconds = seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`;
        return `${minutes}:${seconds}`;
    },
    async execute(message, args, client) {
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
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
            let cookTime = randomInt(6, 48) * 10;
            const confirmation = createEmbed({
                color: blue.hex,
                title: 'confirmation',
                description: 'Your order is now being cooked'
            });
            const user = client.users.cache.get(results[0].userId);
            user.send(confirmation);
            const embedMsgTimer = createEmbed({
                color: silver.hex,
                title: "Timer",
                description: this.getTimeAsString(cookTime),
                footer: {
                    text: `id: ${args[0]}`
                }
            });
            const timerMessage = await sendEmbedWithChannel(embedMsgTimer, client, client.channels.cache.get(text.kitchen));
            const timer = setInterval(() => {
                cookTime-=10;
                let timerString = this.getTimeAsString(cookTime);
                if(client.canSendEmbeds) embedMsgTimer.description = timerString;
                else embedMsgTimer = timerString;
                timerMessage.edit(embedMsgTimer);
                if(cookTime == 0){
                    timerMessage.delete({reason: "timer ran out"});
                    clearTimeout(timer);
                }
            }, 10000);
            await wait(cookTime * 1000);
            query("UPDATE `order` SET status = 'cooked' WHERE orderId = ?", [args[0]]);
            query("UPDATE worker SET cooks = cooks + 1 WHERE workerId = ?", [message.author.id]);
            embedMsg = editEmbed(embedMsg, {
                color: blue.hex,
                description: `Order ${args[0]} is done cooking`
            });
            if(!client.canSendEmbeds) embedMsg = embedMsg.description;
            client.channels.cache.get(text.delivery).send(`<@&${pings.deliver}>`, embedMsg);
            user.send(editEmbed(confirmation, {
                description: `Your order has been cooked`
            }));
            checkProChef(client.member);
        });
    }
}