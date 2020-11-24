const PixelPizza = require("pixel-pizza");
const { createEmbed, sendEmbed, editEmbed, capitalize } = PixelPizza;
const { blue, red } = PixelPizza.colors;
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
    execute(message, args, client) {
        const key = args[0];
        let embedMsg = createEmbed({
            color: red.hex,
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
        query("UPDATE toggle SET `value` = !`value` WHERE `key` = ?", [key]);
        sendEmbed(editEmbed(embedMsg, {
            color: blue.hex,
            description: `Toggle ${key} is now set to ${client.toggles[key]}`
        }), message);
    }
}