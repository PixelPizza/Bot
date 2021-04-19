const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
const ms = require("parse-ms");
const {balance, createEmbed, colors, sendEmbed, editEmbed, getEmoji, config} = PixelPizza;

module.exports = {
    name: "daily",
    description: "Claim your daily money",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    timeout: 24 * 60 * 60 * 1000,
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
        const daily = (await query("SELECT lastDaily as lastDate, dailyStreak as streak FROM `user` WHERE userId = ?", [message.author.id]))[0];
        const dailyDate = daily.lastDate;
        let time = this.timeout - (Date.now() - dailyDate);
        if(dailyDate !== null && time > 0){
            time = ms(time);
            return sendEmbed(editEmbed(embedMsg, {
                title: "**You already claimed it**",
                description: `Cmon, you already claimed your daily money\nPlease try in ${time.hours} hour(s), ${time.minutes} minute(s) and ${time.seconds} second(s)`
            }), client, message);
        }
        let streak = daily.streak ?? 0;
        const rewards = {
            reward: balance.daily.reward,
            streak: balance.daily.streak * streak
        }
        const currency = getEmoji(client.guild, config.currency);
        const reward = rewards.reward + rewards.streak;
        await query("INSERT INTO `user`(`userId`, `balance`) VALUES(?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, lastDaily = DATE(CURRENT_TIMESTAMP), dailyStreak = ?", [message.author.id, reward, reward, streak + 1]);
        sendEmbed(editEmbed(embedMsg, {
            title: "**Here is your daily money**",
            color: colors.green.hex,
            description: `${currency} ${rewards.reward + rewards.streak} has been added to your balance`,
            footer: {
                text: `Streak: ${streak + 1} day(s) (+${rewards.streak})`
            }
        }), client, message);
    }
}