const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
const ms = require("parse-ms");
const {balance, createEmbed, colors, sendEmbed, editEmbed, getEmoji, config} = PixelPizza;

module.exports = {
    name: "yearly",
    description: "Claim your yearly money",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    timeout: 365 * 24 * 60 * 60 * 1000,
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
        const yearly = (await query("SELECT lastYearly as lastDate FROM `user` WHERE userId = ?", [message.author.id]))[0];
        const yearlyDate = yearly.lastDate;
        const timeout = this.timeout + ((yearlyDate?.getFullYear() + 1) % 4 == 0 ? (24 * 60 * 60 * 1000) : 0);
        let time = timeout - (Date.now() - yearlyDate);
        if(yearlyDate !== null && time > 0){
            time = ms(time);
            return sendEmbed(editEmbed(embedMsg, {
                title: "**You already claimed it**",
                description: `Cmon, you already claimed your yearly money\nPlease try again in ${time.days} day(s), ${time.hours} hour(s), ${time.minutes} minute(s) and ${time.seconds} second(s)`
            }), client, message);
        }
        const currency = getEmoji(client.guild, config.currency);
        await query("INSERT INTO `user`(`userId`, `balance`) VALUES(?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, lastYearly = DATE(CURRENT_TIMESTAMP)", [message.author.id, balance.yearly, balance.yearly]);
        sendEmbed(editEmbed(embedMsg, {
            title: "**Here is your yearly money**",
            color: colors.green.hex,
            description: `${currency} ${balance.yearly} has been added to your balance`,
        }), client, message);
    }
}