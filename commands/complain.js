const { createEmbed, colors, capitalize, sendEmbed, editEmbed, channels } = require("pixel-pizza");
const { makeId, query } = require("../dbfunctions");

module.exports = {
    name: "complain",
    description: "make a complaint",
    args: true,
    minArgs: 1,
    usage: "<complaint>",
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
        const complaint = args.join(" ");
        if(complaint.length > 2048){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The complaint is too long, please make it shorter!"
            }), message);
        }
        const id = await makeId("complaint");
        await query("INSERT INTO complaint(complaintId, userId, complaint) VALUES(?, ?, ?)", [id, message.author.id, complaint]);
        let embedMsgComplaint = createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: complaint,
            timestamp: true,
            author: {
                name: message.author.username,
                icon: message.author.displayAvatarURL()
            },
            footer: {
                text: `id: ${id}`
            }
        });
        const channel = client.channels.cache.get(channels.text.complaints);
        if (!client.canSendEmbeds) embedMsgComplaint = embedMsgComplaint.description + `\nId: ${id}`; 
        channel.send(embedMsgComplaint);
        sendEmbed(editEmbed(embedMsg, {
            color: colors.green.hex,
            description: "Your complaint has been sent"
        }), message);
    }
}