const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
const ms = require("parse-ms");
const {balance, createEmbed, colors, sendEmbed, editEmbed, getEmoji, config} = PixelPizza;

module.exports = {
    name: "weekly",
    description: "Claim your weekly money",
    args: false,
    cooldown: 0,
    userType: "vip",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    timeout: 7 * 24 * 60 * 60 * 1000,
    /**
     * Execute this command
     * @param {discord.Message} message
     * @param {string[]} args
     * @param {PixelPizza.PPClient} client
     * @param {{
     *  worker: boolean
     *  teacher: boolean
     *  staff: boolean
     *  director: boolean
     *  botguildMember: discord.GuildMember
     * }} options
     * @returns {Promise<void>}
     */
    async execute(message, args, client, options) {
        const embedMsg = createEmbed({
            color: colors.red.hex
        });
        const weekly = (await query("SELECT lastWeekly as lastDate FROM `user` WHERE userId = ?", [message.author.id]))[0];
        const weeklyDate = weekly.lastDate;
        if(weeklyDate !== null && this.timeout - (Date.now() - weeklyDate) > 0){
            const time = ms(Date.now() - weeklyDate);
            return sendEmbed(editEmbed(embedMsg, {
                title: "**You already claimed it**",
                description: `Cmon, you already claimed your weekly money\nPlease try again in ${time.days} day(s), ${time.hours} hour(s), ${time.minutes} minute(s) and ${time.seconds} second(s)`
            }), client, message);
        }
        const currency = getEmoji(client.guild, config.currency);
        await query("INSERT INTO `user`(`userId`, `balance`) VALUES(?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, lastWeekly = CURRENT_TIMESTAMP", [message.author.id, balance.weekly, balance.weekly]);
        sendEmbed(editEmbed(embedMsg, {
            title: "**Here is your weekly money**",
            color: colors.green.hex,
            description: `${currency} ${balance.weekly} has been added to your balance`,
        }), client, message);
    }
}
