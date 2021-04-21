const discord = require("discord.js");
const e = require("express");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
const ms = require("parse-ms");
const {balance, createEmbed, colors, sendEmbed, editEmbed, getEmoji, config} = PixelPizza;

module.exports = {
    name: "monthly",
    description: "Claim your monthly money",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    getDays(date){
        const month = date?.getMonth();
        const nextMonth = month == 11 ? 0 : month + 1;
        // January, March, May, July, August, October, December
        if([0, 2, 4, 6, 7, 9, 11].includes(nextMonth)){
            return 31;
        }
        // April, June, September, November
        else if ([3, 5, 8, 10].includes(nextMonth)){
            return 30;
        }
        // February or null
        return date?.getFullYear() % 4 == 0 ? 29 : 28;
    },
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
        const monthly = (await query("SELECT lastMonthly as lastDate FROM `user` WHERE userId = ?", [message.author.id]))[0];
        const monthlyDate = monthly.lastDate;
        const timeout = this.getDays(monthlyDate) * 24 * 60 * 60 * 1000;
        let time = timeout - (Date.now() - monthlyDate);
        if(monthlyDate !== null && time > 0){
            time = ms(time);
            return sendEmbed(editEmbed(embedMsg, {
                title: "**You already claimed it**",
                description: `Cmon, you already claimed your monthly money\nPlease try again in ${time.days} day(s), ${time.hours} hour(s), ${time.minutes} minute(s) and ${time.seconds} second(s)`
            }), client, message);
        }
        const currency = getEmoji(client.guild, config.currency);
        await query("INSERT INTO `user`(`userId`, `balance`) VALUES(?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, lastMonthly = CURRENT_TIMESTAMP", [message.author.id, balance.monthly, balance.monthly]);
        sendEmbed(editEmbed(embedMsg, {
            title: "**Here is your monthly money**",
            color: colors.green.hex,
            description: `${currency} ${balance.monthly} has been added to your balance`,
        }), client, message);
    }
}