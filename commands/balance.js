const { getUser, createEmbed, colors, capitalize, sendEmbed, editEmbed, config } = require("pixel-pizza");
const { query } = require('../dbfunctions');

module.exports = {
    name: "balance",
    description: "show your balance",
    aliases: ["bal"],
    usage: "[user]",
    cooldown: 60,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const user = args.length ? message.author : getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "User could not be found"
            }), message);
        }
        const results = await query("SELECT * FROM user WHERE userId = ?", [user.id]);
        const balance = results.length ? results[0].balance : 0;
        sendEmbed(editEmbed(embedMsg, {
            color: colors.blue.hex,
            description: `${config.currency}${balance}`
        }));
    }
}