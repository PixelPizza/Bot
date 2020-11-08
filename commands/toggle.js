const { createEmbed, sendEmbed, randomInt, wait, editEmbed, capitalize } = require("../functions");
const { blue, red } = require('../colors.json');
const { query } = require("../dbfunctions");

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
    needVip: false,
    execute(message, args, client) {
        const key = args[0];
        let embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`,
            description: `Toggle ${key} does not exist`
        });
        const toggles = [];
        for (let toggle in client.toggles) {
            toggles.push(toggle);
        }
        if (!toggles.includes(key)) {
            return sendEmbed(embedMsg, message);
        }
        client.toggles[key] = !client.toggles[key];
        query("UPDATE toggles SET `value` = !`value` WHERE `key` = ?", [key]);
        sendEmbed(editEmbed(embedMsg, {
            color: blue,
            description: `Toggle ${key} is now set to ${client.toggles[key]}`
        }), message);
    }
}