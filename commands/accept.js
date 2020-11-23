const { green, gray, red } = require("../colors.json");
const { query } = require("../dbfunctions");
const { sendEmbed, capitalize, editEmbed, createEmbed } = require("../functions");

module.exports = {
    name: "accept",
    description: "accept an application",
    aliases: ["acceptapp"],
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<application id>",
    cooldown: 0,
    userType: "staff",
    neededPerms: [],
    pponly: true,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        const applications = await query("SELECT * FROM application WHERE applicationId = ? AND status = 'none'", [args[0]]);
        if(!applications.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "The application could not be found or has already been accepted or rejected"
            }), message);
        }
        if(message.author.id === applications[0].userId){
            return sendEmbed(editEmbed(embedMsg, {
                description: "You can't accept your own application"
            }), message);
        }
        const member = client.guildMembers.get(applications[0].userId);
        if(!member){
            return sendEmbed(editEmbed(embedMsg, {
                description: `This user is not in Pixel Pizza`
            }), message);
        }
        await query("UPDATE application SET status = 'accepted', staffId = ? WHERE applicationId = ?", [message.author.id, args[0]]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `${member} has been accepted`
        }), message);
        member.user.send(createEmbed({
            color: gray,
            title: "Accepted",
            description: "Your application has been accepted"
        }));
    }
}