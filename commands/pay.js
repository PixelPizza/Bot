const { getUser, createEmbed, colors, capitalize, sendEmbed, editEmbed, config } = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "pay",
    description: "pay someone money",
    aliases: [],
    args: true,
    minArgs: 2,
    usage: "<amount> <user>",
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const amount = parseInt(args.shift());
        if(isNaN(amount)){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The specified amount is not a number!"
            }), message);
        }
        const user = getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "User could not be found"
            }), message);
        }
        await query("UPDATE `user` SET balance = CASE WHEN userId = ? THEN balance + ? WHEN userId = ? THEN balance - ? END WHERE userId IN(?, ?);", [user.id, amount, message.author.id, amount, user.id, message.author.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: `<@${message.author.id}> payed ${config.currency}${amount} to <@${user.id}>`
        }), message);
    }
}