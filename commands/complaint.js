const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, colors, capitalize, sendEmbed, editEmbed } = PixelPizza;
const { query } = require("../dbfunctions");

module.exports = {
    name: "complaint",
    description: "show a single complaint",
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<complaint id>",
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
        const embedMsg = createEmbed({
            color: colors.red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const results = await query("SELECT * FROM complaint WHERE complaintId = ?", [args[0]]);
        if(!results.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: `Complaint ${args[0]} could not be found`
            }), client, message);
        }
        const notes = await query("SELECT * FROM complaintNote WHERE complaintId = ? ORDER BY rand() LIMIT 25", [args[0]]);
        for(let index in notes){
            const note = notes[index];
            const user = client.users.cache.get(note.userId)?.username || "Unknown Staff Member";
            embedMsg.addField(user, note.note);
        }
        const result = results[0];
        const complaintUser = client.users.cache.get(result.userId);
        let staffMember = "none";
        if(result.staffId) staffMember = client.guildMembers.get(result.staffId) || "Deleted Staff Member";
        sendEmbed(editEmbed(embedMsg, {
            color: colors.blue.hex,
            author: {
                name: complaintUser?.tag || "unknown",
                icon: complaintUser?.displayAvatarURL() || ""
            },
            description: result.complaint,
            footer: {
                text: `id: ${args[0]} | handled: ${result.handled == 1 ? "yes" : "no"} | staff: ${staffMember.displayName || staffMember}`
            }
        }), client, message);
    }
}