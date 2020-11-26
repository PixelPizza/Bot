const { sendEmbed, createEmbed, colors, capitalize } = require("pixel-pizza");
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
    async execute(message, args, client) {
        const strings = await query("SELECT `key` FROM `string`");
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: strings.map(string => string.key).join(", ")
        }), message);
    }
}