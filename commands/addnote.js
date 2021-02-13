const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "addnote",
    description: "add a note to an application, suggestion, bug or complaint",
    args: true,
    minArgs: 3,
    usage: "<type> <id> <note>",
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
        const table = args.shift();
        const id = args.shift();
        if(!["suggestion", "complaint", "bug"].includes(table)){
            return sendEmbed(editEmbed(embedMsg, {
                description: `Please choose suggestion, complaint or bug`
            }), client, message);
        }
        const results = await query(`SELECT * FROM \`${table}\` WHERE \`${table}Id\` = ? AND handled = 0`, [id]);
        if(!results.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `${capitalize(table)} ${id} not found`
            }), client, message);
        }
        await query(`INSERT INTO \`${table}Note\`(${table}Id, userId, note) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE note = CONCAT(note, '\n', VALUES(note))`, [id, message.author.id, args.join(" ")]);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: `Note added`
        }), client, message);
    }
}