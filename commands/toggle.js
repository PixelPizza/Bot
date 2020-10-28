const { createEmbed, sendEmbed, randomInt, wait, editEmbed } = require("../functions");
const { blue, red } = require('../colors.json');

module.exports = {
    name: "toggle",
    description: "toggle a setting on or off",
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<toggle>",
    cooldown: 0,
    userType: "staff",
    neededPerms: [],
    pponly: true,
    removeExp: false,
    execute(message, args, client) {
        let embedMsg = createEmbed({
            color: red,
            title: `**${this.name}**`,
            description: `Toggle ${args[0]} does not exist`
        });
        const toggles = [];
        for (let toggle in client.toggles) {
            toggles.push(toggle);
        }
        if (!toggles.includes(args[0])) {
            return sendEmbed(embedMsg, message);
        }
        if (args[0] == "sendEveryone" && !client.toggles.sendEveryone) {
            wait(60000).then(()=>{
                sendEmbed(editEmbed({
                    color: blue,
                    description: `Never again!`
                }), message);
                message.channel.send("pptoggle sendEveryone");
            });
        } else if (args[0] == "sendEveryone" && message.author != client.user) {
            if (randomInt(0, 100) == randomInt(0, 100)) {
                sendEmbed(editEmbed(embedMsg, {
                    description: `DON'T!`
                }), message);
            }
            return;
        }
        client.toggles[args[0]] = !client.toggles[args[0]];
        sendEmbed(editEmbed(embedMsg, {
            color: blue,
            description: `Toggle ${args[0]} is now set to ${client.toggles[args[0]]}`
        }), message);
    }
}