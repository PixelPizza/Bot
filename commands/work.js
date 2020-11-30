const { randomInt } = require("crypto");
const { config, sendEmbed, createEmbed, colors, capitalize } = require("pixel-pizza");
const { botGuild } = require("pixel-pizza/src/data/config");
const { query } = require('../dbfunctions');

module.exports = {
    name: "work",
    description: "earn money by working",
    aliases: [],
    args: false,
    usage: "usage",
    cooldown: 300,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const guild = client.guilds.cache.get(botGuild);
        const earning = randomInt(config.minWorkEarning, config.maxWorkEarning);
        const causeIndex = randomInt(config.workCauses.length);
        const cause = config.workCauses[causeIndex].replace(/{earning}/g, `${config.currency}${earning}`).replace(/{botguild}/g, guild.name);
        console.log(await query("UPDATE `user` SET balance = balance + ? WHERE userId = ?", [earning, message.author.id]));
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: cause,
            footer: {
                text: `Reply #${causeIndex + 1} of ${config.workCauses.length}`
            }
        }), message);
    }
}