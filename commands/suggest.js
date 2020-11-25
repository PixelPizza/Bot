const { createEmbed, colors, capitalize, sendEmbed, editEmbed, channels } = require("pixel-pizza");
const { makeId, query } = require("../dbfunctions");

module.exports = {
    name: "suggest",
    description: "suggest a feature",
    aliases: [],
    args: true,
    minArgs: 1,
    usage: "<suggestion>",
    cooldown: 30,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const suggestion = args.join(" ");
        if(suggestion.length > 2048){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The suggestion is too long, please make it shorter!"
            }), message);
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
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: "Your suggestion has been sent"
        }), message);
    }
}