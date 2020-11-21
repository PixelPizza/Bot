const { createEmbed, sendEmbed, getUser, inBotGuild, editEmbed } = require("../functions"); 
const { blue, red } = require('../colors.json'); 
const { setLevel } = require("../dbfunctions"); 

module.exports = { 
    name: "levelset", 
    description: "set the level of a user", 
    aliases: ["setlevel"], 
    args: true, 
    minArgs: 1, 
    usage: "<amount> [user]", 
    cooldown: 0, 
    userType: "director", 
    neededPerms: [], 
    pponly: true, 
    removeExp: true, 
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
            title: "**set level**",
            description: `${args[0]} is not a number`
        });
        if (isNaN(args[0])) return sendEmbed(embedMsg, message); 
        if (parseInt(args[0]) < 0) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The number can not be any lower than 0`
            }), message);
        } 
        const amount = args.shift(); 
        let user = message.author; 
        if (args.length) { 
            user = getUser(message, args, client); 
            if (!user) { 
                return sendEmbed(editEmbed(embedMsg, {
                    description: "User not found"
                }), message);
            } 
        } 
        if (!inBotGuild(client, user.id)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not in Pixel Pizza`
            }), message);
        } 
        await setLevel(client, user.id, amount); 
        sendEmbed(editEmbed(embedMsg, {
            color: blue,
            description: `level ${amount} has been set for ${user.tag}`
        }), message); 
    } 
}