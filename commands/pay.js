const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { getUser, createEmbed, colors, capitalize, sendEmbed, editEmbed, config, getEmoji } = PixelPizza;
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
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const amount = parseInt(args.shift());
        if(isNaN(amount)){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The specified amount is not a number!"
            }), client, message);
        }
        const user = getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "User could not be found"
            }), client, message);
        }
        const balance = await query("SELECT balance FROM `user` WHERE userId = ?", [message.author.id]);
        if(balance[0].balance < amount){
            return sendEmbed(editEmbed(embedMsg, {
                description: "You do not have enough balance to pay this"
            }), client, message);
        }
        await query("UPDATE `user` SET balance = balance - ? WHERE userId = ?", [amount, message.author.id]);
        await query("UPDATE `user` SET balance = balance + ? WHERE userId = ?", [amount, user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: `<@${message.author.id}> payed ${getEmoji(client.guild, config.currency)} ${amount} to <@${user.id}>`
        }), client, message);
    }
}