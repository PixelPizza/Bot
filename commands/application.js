const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { query } = require('../dbfunctions'); 
const { createEmbed, sendEmbed, editEmbed, capitalize } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 

module.exports = {
    name: "application",
    description: "look at an application by application id",
    aliases: ["app"],
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<application id>",
    cooldown: 0,
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
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const results = await query("SELECT * FROM application WHERE applicationId = ?", [args[0]]); 
        if (!results.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The application with application id ${args[0]} does not exist`
            }), client, message);
        }
        const result = results[0]; 
        const applyer = client.users.cache.get(result.userId);
        let staffMember = "none";
        if(result.staffId) staffMember = client.guildMembers.get(result.staffId) || "Deleted Staff Member";
        let answers = result.answers;
        const fields = [];
        for(let answer of answers){
            fields.push({name: answer.question, value: answer.answer});
        }
        embedMsg = editEmbed(embedMsg, {
            color: blue.hex,
            title: "Application",
            author: {
                name: applyer?.tag || "Unknown (reject because not in Pixel Pizza)",
                icon: applyer?.displayAvatarURL() || null
            },
            fields: fields,
            footer: {
                text: `id: ${args[0]} | status: ${result.status} | staff: ${staffMember.displayName || staffMember}`
            }
        });
        if(!client.canSendEmbeds){
            embedMsg = "";
            for(let index in fields){
                const field = fields[index];
                embedMsg += `${field.name}\n${field.value}`;
                if(index != fields.length - 1){
                    embedMsg += "\n";
                }
            }
        }
        message.channel.send(embedMsg);
    }
}