const { blue, red, gray, green } = require("../colors.json");
const { query } = require("../dbfunctions");
const { createEmbed, capitalize, sendEmbed, editEmbed } = require("../functions");

module.exports = {
    name: "reject",
    description: "reject an application",
    aliases: ["rejectapp"],
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
                description: "You can't reject your own application"
            }), message);
        }
        const user = client.users.cache.get(applications[0].userId) || "Unknown";
        await query("UPDATE application SET status = 'rejected', staffId = ? WHERE applicationId = ?", [message.author.id, args[0]]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `${user} has been rejected`
        }), message);
        if(user != "Unknown"){
            user.send(createEmbed({
                color: gray,
                title: "Rejected",
                description: "Your application has been rejected"
            }));
        }
    }
}