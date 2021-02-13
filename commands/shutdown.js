const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');

module.exports = {
    name: "shutdown",
    description: "shut the bot down",
    args: false,
    cooldown: 2147483.647,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    hidden: true,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        message.channel.send("I don't think so... don't try again");
    }
}
