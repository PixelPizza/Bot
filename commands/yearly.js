const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
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
        const lastDate = new Date(yearly?.lastDate);
        const yearlyDate = new Date(0);
        yearlyDate.setFullYear(lastDate.getFullYear() + 1);
        if(yearlyDate > message.createdTimestamp){
            const daysLeft = 0;
            return sendEmbed(editEmbed(embedMsg, {
                title: "**You already claimed it**",
                description: `Cmon, you already claimed your yearly money\nPlease try again next year`
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