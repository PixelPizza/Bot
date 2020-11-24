const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
const { createEmbed, capitalize, sendEmbed } = PixelPizza;
const { blue } = PixelPizza.colors;

module.exports = {
    name: "applicationtypes",
    description: "show all application types and if they are opened",
    aliases: ["apptypes"],
    args: false,
    cooldown: 30,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: blue.hex,
            title: `**${capitalize(this.name)}**`
        });
        for(let application of await query(
            "SELECT * \
            FROM toggle \
            WHERE `key` LIKE '%Applications'"
        )){
            embedMsg.addField(application.key.replace("Applications", ""), application.value ? "Open" : "Closed");
        }
        sendEmbed(embedMsg, message);
    }
}