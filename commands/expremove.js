const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, getUser, inBotGuild, editEmbed } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
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
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red.hex,
            title: "**remove exp**",
            description: `${args[0]} is not a number`
        });
        if (isNaN(args[0])) return sendEmbed(embedMsg, client, message); 
        if (parseInt(args[0]) < 1) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The number can not be any lower than 1`
            }), client, message);
        } 
        const amount = parseInt(args.shift()); 
        let user = message.author; 
        if (args.length) { 
            user = getUser(message, args, client); 
            if (!user) { 
                return sendEmbed(editEmbed(embedMsg, {
                    description: "User not found"
                }), client, message);
            } 
        } 
        if (!inBotGuild(client, user.id)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not in Pixel Pizza`
            }), client, message);
        } 
        await addExp(client, user.id, -amount); 
        sendEmbed(editEmbed(embedMsg, {
            color: blue.hex,
            description: `${amount} exp has been removed for ${user.tag}`
        }), client, message); 
    } 
}