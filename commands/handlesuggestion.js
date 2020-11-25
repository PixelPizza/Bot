const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "handlesuggestion",
    description: "handle a suggestion",
    aliases: ["hsuggest", "hsuggestion"],
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<suggestion id>",
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
        const suggestions = await query("SELECT * FROM suggestion WHERE suggestionId = ? AND handled = 0", [args[0]]);
        if(!suggestions.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `Suggestion ${args[0]} not found`
            }), message);
        }
        await query("UPDATE suggestion SET handled = 1, staffId = ? WHERE suggestionId = ?", [message.author.id, args[0]]);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: "Suggestion handled"
        }), message);
    }
}