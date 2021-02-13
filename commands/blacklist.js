const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const {green, red} = PixelPizza.colors;
const {creators} = PixelPizza.config;
const { query } = require('../dbfunctions');
const { createEmbed, capitalize, getUser, sendEmbed, editEmbed } = PixelPizza;

module.exports = {
    name: "blacklist",
    description: "blacklist a user from using pixel pizza commands",
    aliases: ["bl"],
    args: true,
    minArgs: 1,
    usage: "<user>",
    cooldown: 0,
    userType: "director",
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
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const user = getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "Could not find user"
            }), client, message);
        }
        if (creators.includes(user.id)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user can not be blacklisted!`
            }), client, message);
        }
        if (user.id == message.author.id){
            return sendEmbed(editEmbed(embedMsg, {
                description: `You can't blacklist yourself!`
            }), client, message);
        }
        const blacklisted = await query("SELECT * FROM blacklisted WHERE userId = ?", [user.id]);
        if(blacklisted.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user has already been blacklisted"
            }), client, message);
        }
        query("INSERT INTO blacklisted(userId) VALUES(?)", [user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: green.hex,
            description: `${user} has been blacklisted`
        }), client, message);
    }
}