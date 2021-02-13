const discord = require('discord.js');
const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "unhandle",
    description: "unahndle a handled complaint, suggestion or bug",
    aliases: [],
    args: true,
    minArgs: 2,
    maxArgs: 2,
    usage: "<suggestion | complaint | bug> <suggestion id | complaint id | bug id>",
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
        if(!["suggestion", "complaint", "bug"].includes(table)){
            return sendEmbed(editEmbed(embedMsg, {
                description: `please choose suggestion, complaint or bug`
            }), client, message);
        }
        const suggestions = await query(`SELECT * FROM \`${table}\` WHERE \`${table}Id\` = ? AND handled = 1`, [id]);
        if(!suggestions.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `${capitalize(table)} ${id} not found`
            }), client, message);
        }
        await query(`UPDATE \`${table}\` SET handled = 0, staffId = ? WHERE \`${table}Id\` = ?`, [message.author.id, id]);
        await sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: `${capitalize(table)} ${id} unhandled`
        }), client, message);
        try {
            message.delete();
        } catch {}
    }
}