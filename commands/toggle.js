const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, editEmbed, capitalize } = PixelPizza;
const { red } = PixelPizza.colors;
const { query } = require("../dbfunctions");

module.exports = {
    name: "toggle",
    description: "toggle a setting on or off",
    args: true,
    minArgs: 1,
    maxArgs: 2,
    usage: "<toggle> [on | off]",
    cooldown: 0,
    userType: "staff",
    neededPerms: [],
    pponly: true,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`,
        });
        const key = args[0];
        const toggle = args[1];
        if(!toggle){
            sendEmbed(editEmbed(embedMsg, {
                color: PixelPizza.colors.blue.hex,
                description: `Toggle ${key} is ${client.toggles[key] ? "on" : "off"}`
            }), message);
        } else if (["on", "off"].includes(toggle)) {
            if (!client.toggles[key]) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: `Toggle ${key} does not exist`
                }), message);
            }
            client.toggles[key] = toggle == "on" ? true : false;
            await query("UPDATE toggle SET `value` = ? WHERE `key` = ?", [toggle == "on" ? 1 : 0, key]);
            sendEmbed(editEmbed(embedMsg, {
                color: PixelPizza.colors.green.hex,
                description: `Toggle ${key} is now ${toggle}`
            }), message);
        } else {
            sendEmbed(editEmbed(embedMsg, {
                description: "Please choose on or off as value"
            }), message);
        }
    }
}