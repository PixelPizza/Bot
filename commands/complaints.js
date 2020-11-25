const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = require("pixel-pizza");
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
        }), message);
    }
}