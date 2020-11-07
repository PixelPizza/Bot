const { createEmbed, sendEmbed, editEmbed, capitalize } = require("../functions"); 
const { blue, red } = require('../colors.json'); 
const rules = require('../rules.json'); 
const { error } = require("../consolefunctions");

module.exports = { 
    name: "rules", 
    description: "show the rules of pixel pizza", 
    args: false, 
    cooldown: 30, 
    userType: "all", 
    neededPerms: [], 
    pponly: false, 
    execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: blue,
            title: `**${capitalize(this.name)}**`
        });
        return message.author.send(editEmbed(embedMsg, {
            description: `\`\`\`\n${rules.join("\n")}\`\`\``
        })).then(() => { 
            if (message.channel.type === "dm") return; 
            embedMsg.setDescription("I've sent you a DM with all rules"); 
        }).catch(err => {
            error(`Could not send rules DM to ${message.author.tag}`, err);
            embedMsg.setColor(red).setDescription('I can\'t DM you. Do you have DMs disabled?'); 
        }).finally(() => sendEmbed(embedMsg, message)); 
    } 
}