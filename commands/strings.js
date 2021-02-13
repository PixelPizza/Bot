const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { sendEmbed, createEmbed, colors, capitalize } = PixelPizza;
const {query} = require("../dbfunctions");

module.exports = {
    name: "strings",
    description: "show all database strings",
    args: false,
    cooldown: 60,
    userType: "staff",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const strings = await query("SELECT `key` FROM `string`");
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: strings.map(string => string.key).join(", ")
        }), client, message);
    }
}