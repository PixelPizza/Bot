const { query } = require('../dbfunctions'); 
const { createEmbed, sendEmbed, editEmbed, capitalize } = require("../functions"); 
const { blue, red } = require('../colors.json'); 
const questions = require('../questions.json');

module.exports = {
    name: "application",
    description: "look at an application by application id",
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
        let embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        const results = await query("SELECT * FROM application WHERE applicationId = ?", [args[0]]); 
        if (!results.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The application with application id ${args[0]} does not exist`
            }), message);
        }
        const result = results[0]; 
        const applyer = client.users.cache.get(result.userId).username;
        let staffMember = "none";
        if(result.staffId) client.guildMembers.get(result.staffId) ? client.users.cache.get(result.staffId) : "Deleted Staff Member";
        let answers = JSON.parse(result.answers);
        console.log(answers);
    }
}