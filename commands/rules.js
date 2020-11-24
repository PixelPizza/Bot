const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, editEmbed, capitalize, error } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
const {rules} = PixelPizza.rules; 

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
            color: blue.hex,
            title: `**${capitalize(this.name)}**`
        });
        return message.author.send(editEmbed(embedMsg, {
            description: `\`\`\`\n${rules.join("\n")}\`\`\``
        })).then(() => { 
            if (message.channel.type === "dm") return; 
            embedMsg.setDescription("I've sent you a DM with all rules"); 
        }).catch(err => {
            error(`Could not send rules DM to ${message.author.tag}`, err);
            embedMsg.setColor(red.hex).setDescription('I can\'t DM you. Do you have DMs disabled?'); 
        }).finally(() => sendEmbed(embedMsg, message)); 
    } 
}