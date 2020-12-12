const discord = require('discord.js');
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
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`,
        });
        const key = args[0];
        const toggle = args[1];
        if(!toggle && client.toggles[key] !== undefined){
            sendEmbed(editEmbed(embedMsg, {
                color: PixelPizza.colors.blue.hex,
                description: `Toggle ${key} is ${client.toggles[key] ? "on" : "off"}`
            }), client, message);
        } else if (["on", "off"].includes(toggle)) {
            if (!client.toggles[key] && client.toggles[key] !== false) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: `Toggle ${key} does not exist`
                }), client, message);
            }
            client.toggles[key] = toggle == "on" ? true : false;
            await query("UPDATE toggle SET `value` = ? WHERE `key` = ?", [toggle == "on" ? 1 : 0, key]);
            sendEmbed(editEmbed(embedMsg, {
                color: PixelPizza.colors.green.hex,
                description: `Toggle ${key} is now ${toggle}`
            }), client, message);
        } else {
            sendEmbed(editEmbed(embedMsg, {
                description: toggle ? "Please choose on or off as value" : `Toggle ${key} does not exist`
            }), client, message);
        }
    }
}