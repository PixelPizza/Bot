const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, hasRole, sendEmbed, editEmbed, isImage } = PixelPizza;
const { red, green } = PixelPizza.colors;
const { cook } = PixelPizza.roles;
const { query } = require("../dbfunctions");
const { text } = PixelPizza.channels;

module.exports = {
    name: "change",
    description: "change the image of a cooking or cooked order",
    args: true,
    minArgs: 1,
    maxArgs: 2,
    usage: "<order id> <image | image link>",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
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
        const embedMsg = createEmbed({
            color: red.hex,
            title: "change image"
        });
        if (!hasRole(options.botguildMember, cook)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to have the ${client.guild.roles.cache.get(cook).name} role in ${client.guild.name} to be able to claim an order`
            }), client, message);
        }
        if (message.attachments.array().length > 1) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `There are too many attachments! please send only one image with the message!`
            }), client, message);
        }
        let results = await query(
            "SELECT * \
            FROM `order` \
            WHERE orderId = ? AND status IN('cooking','cooked')",
            [args[0]]
        );
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `Order ${args[0]} has not been found with the cooking or cooked status`
            }), client, message);
        }
        if (results[0].cookId != message.author.id) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `The image of the order can only be changed by the cook who claimed it`
            }), client, message);
        }
        const url = message.attachments.first()?.url || args[1];
        if (!isImage(url)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This link is invalid`
            }), client, message);
        }
        client.channels.cache.get(text.images).send({files: [url]}).then(msg => {
            query(
                "UPDATE `order` \
                SET imageUrl = ? \
                WHERE orderId = ?",
                [msg.attachments.first().url, args[0]]
            );
            sendEmbed(editEmbed(embedMsg, {
                color: green.hex,
                description: `The image of the order has been changed`
            }), client, message);
        });
    }
}