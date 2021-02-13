const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, getUser, inBotGuild, editEmbed, capitalize } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
const { query } = require('../dbfunctions'); 

module.exports = { 
    name: "worker", 
    description: "get info on a pixel pizza worker with the user id", 
    usage: "[user id]", 
    cooldown: 0, 
    userType: "staff", 
    neededPerms: [], 
    ppOnly: true, 
    removeExp: false, 
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
        const user = args.length ? getUser(message, args, client) : message.author;
        if (!user) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `user not found`
            }), client, message);
        } 
        if (!inBotGuild(client, user.id)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not in pixel pizza`
            }), client, message);
        } 
        const result = await query("SELECT * FROM worker WHERE workerId = ?", [user.id]); 
        if (!result.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not a pixel pizza worker`
            }), client, message);
        } 
        const worker = result[0]; 
        const member = client.guildMembers.get(user.id); 
        if (!worker.deliveryMessage) worker.deliveryMessage = "none"; 
        embedMsg = editEmbed(embedMsg, {
            color: blue.hex,
            fields: [
                { name: "Nickname", value: member.displayName }, 
                { name: "Cooks", value: worker.cooks, inline: true }, 
                { name: "Deliveries", value: worker.deliveries, inline: true }, 
                { name: "Delivery Message", value: worker.deliveryMessage }, 
                { name: "Added At", value: worker.addedAt }
            ]
        });
        if (!client.canSendEmbeds) embedMsg = `Nickname\n\`${member.displayName}\`\nCooks\n\`${worker.cooks}\`\nDeliveries\n\`${worker.deliveries}\`\nDelivery Message\n\`\`\`\n${worker.deliveryMessage}\n\`\`\`\nAdded At\n\`${worker.addedAt}\``; 
        message.channel.send(embedMsg); 
    } 
}