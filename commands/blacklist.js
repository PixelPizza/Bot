const {green, red} = require('../colors.json');
const {creators} = require('../config.json');
const { query } = require('../dbfunctions');
const { createEmbed, capitalize, getUser, sendEmbed, editEmbed } = require('../functions');

module.exports = {
    name: "blacklist",
    description: "blacklist a user from pixel pizza",
    aliases: ["bl"],
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
        if (creators.includes(user.id)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user can not be blacklisted!`
            }), message);
        }
        if (user.id == message.author.id){
            return sendEmbed(editEmbed(embedMsg, {
                description: `You can't blacklist yourself!`
            }), message);
        }
        const blacklisted = await query("SELECT * FROM blacklisted WHERE userId = ?", [user.id]);
        if(blacklisted.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user has already been blacklisted"
            }), message);
        }
        query("INSERT INTO blacklisted(userId) VALUES(?)", [user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `${user} has been blacklisted`
        }), message);
    }
}