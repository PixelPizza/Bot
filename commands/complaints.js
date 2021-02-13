const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, colors, capitalize, sendEmbed } = PixelPizza;
const { query } = require("../dbfunctions");

module.exports = {
    name: "complaints",
    description: "show all complaints",
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
        const results = await query("SELECT * FROM complaint WHERE handled = 0");
        let complaintString = results.length ? "`" : "No complaints have been found";
        for(let i in results){
            let result = results[i];
            complaintString += result.complaintId;
            if(i == results.length - 1){
                complaintString += "`";
            } else {
                complaintString += ", ";
            }
        }
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: complaintString
        }), client, message);
    }
}