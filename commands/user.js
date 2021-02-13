const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, editEmbed, capitalize, getUser } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
const { query } = require('../dbfunctions'); 

module.exports = { 
    name: "user", 
    description: "get a users info with the users id", 
    args: true, 
    minArgs: 1, 
    usage: "<user>", 
    cooldown: 0, 
    userType: "staff", 
    neededPerms: [], 
    pponly: false, 
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
            title: `**${capitalize(this.name)}**`,
            author: {
                name: message.author.username,
                icon: message.author.displayAvatarURL()
            },
            timestamp: true,
            footer: {
                text: client.user.username,
                icon: client.user.displayAvatarURL()
            }
        });
        let user = getUser(message, args, client);
        if (!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "user not found"
            }), client, message);
        }
        const member = client.guildMembers.get(user.id); 
        const result = await query("SELECT * FROM user WHERE userId = ?", [user.id]); 
        if (!result.length || !member) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not in pixel pizza`
            }), client, message);
        } 
        user = result[0]; 
        embedMsg = editEmbed(embedMsg, {
            color: blue.hex,
            fields: [
                { name: "Nickname", value: member.displayName }, 
                { name: "Exp", value: user.exp }, 
                { name: "Level", value: user.level }, 
                { name: "Balance", value: user.balance }
            ]
        }); 
        if (!client.canSendEmbeds) { 
            embedMsg = `Nickname\n\`${member.displayName}\`\nExp\n\`${user.exp}\`\nLevel\n\`${user.level}\`\nBalance\n\`${user.balance}\``; 
        } 
        message.channel.send(embedMsg); 
    } 
}