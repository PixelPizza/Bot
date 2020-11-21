const { createEmbed, sendEmbed, getUser, inBotGuild, editEmbed } = require("../functions"); 
const { blue, red } = require('../colors.json'); 
const { addExp } = require("../dbfunctions"); 

module.exports = { 
    name: "expremove", 
    description: "remove exp from a user", 
    aliases: ["removeexp"], 
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
            title: "**remove exp**",
            description: `${args[0]} is not a number`
        });
        if (isNaN(args[0])) return sendEmbed(embedMsg, message); 
        if (parseInt(args[0]) < 1) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The number can not be any lower than 1`
            }), message);
        } 
        const amount = parseInt(args.shift()); 
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
        await addExp(client, user.id, -amount); 
        sendEmbed(editEmbed(embedMsg, {
            color: blue,
            description: `${amount} exp has been removed for ${user.tag}`
        }), message); 
    } 
}