const {createEmbed, sendEmbed, colors, rules} = require("pixel-pizza");
const {query} = require("../dbfunctions");

module.exports = {
    name: "anarchy",
    description: "show info on anarchy day",
    args: false,
    cooldown: 300,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const date = await query("SELECT value FROM string WHERE `key` = 'anarchyDay'");
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: "**Anarchy day**",
            description: "Info on anarchy day",
            fields: [
                {
                    name: "Date",
                    value: date[0]?.value || "No date set"
                },
                {
                    name: "Info",
                    value: "Anarchy day is a day where you can order **almost** anything"
                },
                {
                    name: "Rules",
                    value: rules.anarchyRules.join("\n")
                }
            ],
            footer: {
                text: "If they date has expired it means no new date has been planned\nThere are still some rules to follow"
            }
        }), message);
    }
}