const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { createEmbed, colors, capitalize, sendEmbed, editEmbed, channels } = PixelPizza;
const { makeId, query } = require("../dbfunctions");

module.exports = {
    name: "report",
    description: "report a bug",
    args: true,
    minArgs: 1,
    usage: "<bug>",
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
        const bug = args.join(" ");
        if(bug.length > 2048){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The bug is too long, please make it shorter!"
            }), client, message);
        }
        const id = await makeId("bug");
        await query("INSERT INTO bug(bugId, userId, bug) VALUES(?, ?, ?)", [id, message.author.id, bug]);
        let embedMsgBug = createEmbed({
            color: colors.blue.hex,
            title: `**Bug**`,
            description: bug,
            timestamp: true,
            author: {
                name: message.author.username,
                icon: message.author.displayAvatarURL()
            },
            footer: {
                text: `id: ${id}`
            }
        });
        const channel = client.channels.cache.get(channels.text.bugs);
        if (!client.canSendEmbeds) embedMsgBug = embedMsgBug.description + `\nId: ${id}`; 
        channel.send(embedMsgBug);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: "Your bug report has been sent"
        }), client, message);
    }
}