const { randomInt } = require('crypto');
const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, hasRole, sendEmbed, isImage, editEmbed, wait, capitalize } = PixelPizza;
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
    /**
     * Change seconds to a string of minutes and seconds
     * @param {number} time 
     */
    getTimeAsString(time){
        let minutes = Math.floor(time / 60);
        minutes = minutes >= 10 ? minutes.toString() : `0${minutes.toString()}`;
        let seconds = time % 60;
        seconds = seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`;
        return `${minutes}:${seconds}`;
    },
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @param {{
     *  worker: boolean,
     *  teacher: boolean,
     *  staff: boolean,
     *  director: boolean,
     *  botguildMember: discord.GuildMember
     * }} options
     * @returns {Promise<void>}
     */
    async execute(message, args, client, options) {
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const cookRole = client.guild.roles.cache.get(cook);
        if (!hasRole(options.botguildMember, cook)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${cookRole.name} role in ${client.guild.name} to be able to cook an order`
            }), client, message);
        }
        if (message.attachments.array().length > 1) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `There are too many attachments! please send only one image with the message!`
            }), client, message);
        }
        let results = await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'claimed'", [args[0]]);
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the claimed status`
            }), client, message);
        }
        if (results[0].cookId != message.author.id) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This order has already been claimed by someone else`
            }), client, message);
        }
        let url = message.attachments.first()?.url || args[1];
        if (!isImage(url)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This link is invalid`
            }), client, message);
        }
        client.channels.cache.get(text.images).send({files: [url]}).then(async msg => {
            query(
                "UPDATE `order` \
                SET imageUrl = ?, status = 'cooking' \
                WHERE orderId = ?",
                [msg.attachments.first().url, args[0]]
            );
            let cookTime = randomInt(1 * 6, 6 * 6) * 10;
            const confirmation = createEmbed({
                color: blue.hex,
                title: 'confirmation',
                description: 'Your order is now being cooked'
            });
            const user = client.users.cache.get(results[0].userId);
            user?.send(confirmation);
            const earning = randomInt(50, 250);
            query("UPDATE `user` SET balance = balance + ? WHERE userId = ?", [earning, message.author.id]);
            query("UPDATE worker SET cooks = cooks + 1 WHERE workerId = ?", [message.author.id]);
            checkProChef(client.guildMembers.get(message.author.id));
            const embedMsgTimer = createEmbed({
                color: silver.hex,
                title: "Timer",
                description: this.getTimeAsString(cookTime),
                footer: {
                    text: `id: ${args[0]}`
                }
            });
            const timerMessage = await sendEmbed(embedMsgTimer, client, client.channels.cache.get(text.kitchen));
            const timer = setInterval(() => {
                cookTime-=10;
                let timerString = this.getTimeAsString(cookTime);
                if(client.canSendEmbeds) embedMsgTimer.description = timerString;
                else embedMsgTimer = timerString;
                timerMessage.edit(embedMsgTimer);
                if(cookTime == 0){
                    timerMessage.edit({embed: createEmbed({
                        color: PixelPizza.colors.green.hex,
                        title: "Order is done",
                        description: [
                            `Order ${args[0]} is done cooking`,
                            `${message.author} earned ${PixelPizza.getEmoji(client.guild, PixelPizza.config.currency)} ${earning}`
                        ]
                    })});
                    clearInterval(timer);
                }
            }, 10000);
            await wait(cookTime * 1000);
            const result = await query("UPDATE `order` SET status = 'cooked', cookedAt = CURRENT_TIMESTAMP WHERE orderId = ? AND status = 'cooking'", [args[0]]);
            if(result.affectedRows > 0){
                embedMsg = editEmbed(embedMsg, {
                    color: blue.hex,
                    description: `Order ${args[0]} is done cooking`
                });
                if(!client.canSendEmbeds) embedMsg = embedMsg.description;
                client.channels.cache.get(text.delivery).send(`<@&${pings.deliver}>`, embedMsg);
                user?.send(editEmbed(confirmation, {
                    description: `Your order has been cooked`
                }));
            }
        });
    }
}