const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, colors, capitalize, sendEmbed } = PixelPizza;
const { query } = require("../dbfunctions");

module.exports = {
    name: "bugs",
    description: "show all bugs",
    args: false,
    cooldown: 0,
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
        const results = await query("SELECT * FROM bug WHERE handled = 0");
        let bugString = results.length ? "`" : "No bugs have been found";
        for(let i in results){
            let result = results[i];
            bugString += result.bugId;
            if(i == results.length - 1){
                bugString += "`";
            } else {
                bugString += ", ";
            }
        }
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: bugString
        }), client, message);
    }
}