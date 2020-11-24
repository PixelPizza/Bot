const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "suggestions",
    description: "show all suggestions",
    aliases: ["suggests"],
    args: false,
    cooldown: 0,
    userType: "staff",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const results = await query("SELECT * FROM suggestion WHERE handled = 0");
        let suggestString = results.length ? "`" : "No suggestions have been found";
        for(let i in results){
            let result = results[i];
            suggestString += result.suggestionId;
            if(i == results.length - 1){
                suggestString += "`";
            } else {
                suggestString += ", ";
            }
        }
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: suggestString
        }), message);
    }
}