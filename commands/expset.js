const { setExp } = require("../dbfunctions"); 
const { getUser, inBotGuild, sendEmbed, createEmbed, editEmbed } = require("../functions"); 
const { blue, red } = require('../colors.json'); 

module.exports = { 
    name: "expset", 
    description: "set the exp of a user", 
    aliases: ["setexp"], 
    args: true, 
    minArgs: 1, 
    usage: "<amount> [user]", 
    cooldown: 0, 
    userType: "director", 
    neededPerms: [], 
    pponly: true, 
    removeExp: true, 
    needVip: false,
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
            title: "**set exp**",
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
        await setExp(client, user.id, amount); 
        sendEmbed(editEmbed(embedMsg, {
            color: blue,
            description: `${amount} exp has been set for ${user.tag}`
        }), message);
    } 
}