const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { createEmbed, capitalize } = PixelPizza;
const { blue } = PixelPizza.colors;

module.exports = { 
    name: "toggles", 
    description: "shows all toggles", 
    args: false, 
    cooldown: 60, 
    userType: "staff", 
    neededPerms: [], 
    pponly: true, 
    removeExp: false, 
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) { 
        const toggles = []; 
        for (let toggle in client.toggles) { 
            toggles.push(toggle); 
        } 
        message.channel.send(createEmbed({
            color: blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: toggles.join(", ")
        })); 
    } 
}