const {green, red} = require('../colors.json');
const {creators} = require('../config.json');
const { query } = require('../dbfunctions');
const { createEmbed, capitalize, getUser, sendEmbed, editEmbed } = require('../functions');

module.exports = {
    name: "unblacklist",
    description: "unblacklist a user",
    aliases: ["ubl"],
    args: true,
    minArgs: 1,
    usage: "<user>",
    cooldown: 0,
    userType: "director",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        const user = getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "Could not find user"
            }), message);
        }
        if (user.id == message.author.id){
            return sendEmbed(editEmbed(embedMsg, {
                description: `You can't unblacklist yourself!`
            }), message);
        }
        const blacklisted = await query("SELECT * FROM blacklisted WHERE userId = ?", [user.id]);
        if(!blacklisted.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user has not been blacklisted"
            }), message);
        }
        query("DELETE FROM blacklisted WHERE userId = ?", [user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `${user} has been unblacklisted`
        }), message);
    }
}