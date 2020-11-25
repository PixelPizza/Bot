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
            }), message);
        }
        const suggestions = await query(`SELECT * FROM \`${table}\` WHERE \`${table}Id\` = ? AND handled = 0`, [id]);
        if(!suggestions.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `${capitalize(table)} ${id} not found`
            }), message);
        }
        await query(`UPDATE \`${table}\` SET handled = 1, staffId = ? WHERE \`${table}Id\` = ?`, [message.author.id, id]);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: `${capitalize(table)} handled`
        }), message);
    }
}