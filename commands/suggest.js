const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, colors, capitalize, sendEmbed, editEmbed, channels } = PixelPizza;
const { makeId, query } = require("../dbfunctions");

module.exports = {
    name: "suggest",
    description: "suggest a feature",
    aliases: [],
    args: true,
    minArgs: 1,
    usage: "<suggestion>",
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
        const suggestion = args.join(" ");
        if(suggestion.length > 2048){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The suggestion is too long, please make it shorter!"
            }), client, message);
        }
        const id = await makeId("suggestion");
        await query("INSERT INTO suggestion(suggestionId, userId, suggestion) VALUES(?, ?, ?)", [id, message.author.id, suggestion]);
        let embedMsgSuggestion = createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: suggestion,
            timestamp: true,
            author: {
                name: message.author.username,
                icon: message.author.displayAvatarURL()
            },
            footer: {
                text: `id: ${id}`
            }
        });
        const channel = client.channels.cache.get(channels.text.suggestions);
        if (!client.canSendEmbeds) embedMsgSuggestion = embedMsgSuggestion.description + `\nId: ${id}`; 
        channel.send(embedMsgSuggestion);
        const sentMessage = await sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: "Your suggestion has been sent"
        }), client, message);
        try {
            message.delete();  
        } catch {}
        setTimeout(() => sentMessage.delete(), 5000);
    }
}