const discord = require('discord.js');
const { randomInt } = require("crypto");
const { config, sendEmbed, createEmbed, colors, capitalize, getEmoji, PPClient } = require("pixel-pizza");
const { query } = require('../dbfunctions');

module.exports = {
    name: "work",
    description: "earn money by working",
    aliases: [],
    args: false,
    usage: "usage",
    cooldown: 30 * 60,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const guild = client.guilds.cache.get(config.botGuild);
        const earning = randomInt(config.minWorkEarning, config.maxWorkEarning);
        const causeIndex = randomInt(config.workCauses.length);
        const cause = config.workCauses[causeIndex]
            .replace(/{earning}/g, `${getEmoji(client.guild, config.currency)} ${earning}`)
            .replace(/{name}/g, config.workNames[randomInt(config.workNames.length)])
            .replace(/{botguild}/g, guild.name);
        await query("INSERT INTO `user`(`userId`, `balance`) VALUES(?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?", [message.author.id, earning, earning]);
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: cause,
            footer: {
                text: `Reply #${causeIndex + 1} of ${config.workCauses.length}`
            }
        }), client, message);
    }
}
