const { createEmbed, capitalize } = require("../functions");
const { blue } = require('../colors.json');

module.exports = { 
    name: "toggles", 
    description: "shows all toggles", 
    args: false, 
    cooldown: 60, 
    userType: "staff", 
    neededPerms: [], 
    pponly: true, 
    removeExp: false, 
    needVip: false,
    execute(message, args, client) { 
        const toggles = []; 
        for (let toggle in client.toggles) { 
            toggles.push(toggle); 
        } 
        message.channel.send(createEmbed({
            color: blue,
            title: `**${capitalize(this.name)}**`,
            description: toggles.join(", ")
        })); 
    } 
}