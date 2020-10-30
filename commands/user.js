const { createEmbed, sendEmbed, editEmbed, capitalize } = require('../functions'); 
const { blue, red } = require('../colors.json'); 
const { query } = require('../dbfunctions'); 

module.exports = { 
    name: "user", 
    description: "get a users info with the users id", 
    args: true, 
    minArgs: 1, 
    maxArgs: 1, 
    usage: "<user id>", 
    cooldown: 0, 
    userType: "staff", 
    neededPerms: [], 
    pponly: false, 
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
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
        if (isNaN(args[0]) || args[0].length != 18) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `${args[0]} is not a user id`
            }), message);
        } 
        const userId = args[0];  
        const member = client.guildMembers.get(args[0]); 
        const result = await query("SELECT * FROM user WHERE userId = ?", [userId]); 
        if (!result.length || !member) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not in pixel pizza`
            }), message);
        } 
        const user = result[0]; 
        embedMsg = editEmbed(embedMsg, {
            color: blue,
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