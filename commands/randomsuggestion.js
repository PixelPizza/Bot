const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");

module.exports = {
    name: "randomsuggestion",
    description: "show a random unhandled suggestion",
    aliases: ["randomsuggest", "rsuggest", "rsuggestion"],
    args: false,
    cooldown: 0,
    userType: "staff",
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
        const embedMsg = PixelPizza.createEmbed({
            color: PixelPizza.colors.blue.hex,
            title: `**Suggestion**`
        });
        const suggestions = await query("SELECT * FROM suggestion WHERE handled = 0 ORDER BY rand() LIMIT 1");
        if(!suggestions.length){
            return PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: "No suggestions found"
            }), client, message);
        }
        const suggestion = suggestions[0];
        const notes = await query("SELECT * FROM suggestionNote WHERE suggestionId = ? ORDER BY rand() LIMIT 25", [suggestion.suggestionId]);
        for(let index in notes){
            const note = notes[index];
            const user = client.users.cache.get(note.userId)?.username || "Unknown Staff Member";
            embedMsg.addField(user, note.note);
        }
        const suggestUser = client.users.cache.get(suggestion.userId);
        PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
            author: {
                name: suggestUser?.tag || "unknown",
                icon: suggestUser?.displayAvatarURL() || ""
            },
            description: suggestion.suggestion,
            footer: {
                text: `id: ${suggestion.suggestionId} | handled: no | staff: none`
            }
        }), client, message);
        try {
            message.delete();
        } catch {}
    }
}