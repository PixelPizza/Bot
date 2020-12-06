const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "handle",
    description: "handle a suggestion or complaint",
    args: true,
    minArgs: 2,
    maxArgs: 2,
    usage: "<suggestion | complaint> <suggestion id | complaint id>",
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
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const table = args[0];
        const id = args[1];
        if(!["suggestion", "complaint"].includes(table)){
            return sendEmbed(editEmbed(embedMsg, {
                description: `please choose suggestion or complaint`
            }), client, message);
        }
        const suggestions = await query(`SELECT * FROM \`${table}\` WHERE \`${table}Id\` = ? AND handled = 0`, [id]);
        if(!suggestions.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `${capitalize(table)} ${id} not found`
            }), client, message);
        }
        await query(`UPDATE \`${table}\` SET handled = 1, staffId = ? WHERE \`${table}Id\` = ?`, [message.author.id, id]);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: `${capitalize(table)} handled`
        }), client, message);
    }
}