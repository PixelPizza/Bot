const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, editEmbed } = PixelPizza;
const { red, green } = PixelPizza.colors;
const { prefix } = PixelPizza.config;
const { query } = require("../dbfunctions");

module.exports = {
    name: "cancel",
    description: "cancel your order",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: "**no order**",
            description: `You have not ordered anything, use ${prefix}order to order a pizza`
        });
        const result = await query(
            "SELECT * \
            FROM `order` \
            WHERE userId = ?",
            [message.author.id]
        );
        if (!result.length) return sendEmbed(embedMsg, message);
        query(
            "DELETE \
            FROM `order` \
            WHERE userId = ?",
            [message.author.id]
        );
        sendEmbed(editEmbed(embedMsg, {
            color: green.hex,
            title: "cancel order",
            description: "Your order has been canceled"
        }), message);
    }
}