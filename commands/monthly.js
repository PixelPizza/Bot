const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
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
        const monthlyDate = new Date(monthly?.lastDate);
        monthlyDate.setMonth(monthlyDate.getMonth() + 1);
        monthlyDate.setDate(1);
        monthlyDate.setHours(0);
        monthlyDate.setMinutes(0);
        monthlyDate.setSeconds(0);
        if(monthlyDate > message.createdTimestamp){
            return sendEmbed(editEmbed(embedMsg, {
                title: "**You already claimed it**",
                description: `Cmon, you already claimed your monthly money\nPlease try again next month`
            }), client, message);
        }
        const currency = getEmoji(client.guild, config.currency);
        await query("INSERT INTO `user`(`userId`, `balance`) VALUES(?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, lastMonthly = DATE(CURRENT_TIMESTAMP)", [message.author.id, balance.monthly, balance.monthly]);
        sendEmbed(editEmbed(embedMsg, {
            title: "**Here is your monthly money**",
            color: colors.green.hex,
            description: `${currency} ${balance.monthly} has been added to your balance`,
        }), client, message);
    }
}