const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const { query, checkLevel } = require('../dbfunctions');
const {voteLog} = PixelPizza.webhooks;

module.exports = {
    name: "claimvote",
    description: "claim rewards for voting on the bot",
    aliases: ["cvote"],
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
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const rewards = {
            balance: 200,
            exp: 500,
            overflowPass: true
        };
        const embedMsg = PixelPizza.createEmbed({
            color: PixelPizza.colors.red.hex
        });
        if(!await client.dbl.hasVoted(message.author.id)){
            return PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
                title: "**Not voted**",
                description: `You have not voted\nYou can vote on ${client.user.username} with this link\nhttps://top.gg/bot/${client.user.id}/vote`
            }), client, message);
        }
        /*
         * Check if already claimed
         */
        const lastVote = await query("SELECT lastVote FROM `user` WHERE userId = ?", [message.author.id]);
        const voteDate = new Date(lastVote[0].lastVote);
        // add 12 hours to last vote date
        voteDate.setTime(voteDate.getTime() + 12 * 60 * 60 * 1000);
        if(voteDate > message.createdTimestamp){
            return PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
                title: "**Already claimed**",
                description: `You have already claimed your rewards for voting`
            }), client, message);
        }
        await query("UPDATE `user` SET balance = balance + ?, exp = exp + ?, lastVote = ? WHERE userId = ?", [rewards.balance, rewards.exp, message.createdAt, message.author.id]);
        await checkLevel(client, message.author.id);
        PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
            title: "**Rewards claimed**",
            color: PixelPizza.colors.blue.hex,
            description: "You have claimed your rewards for voting",
            fields: [
                {
                    name: "Rewards",
                    value: `${rewards.balance ? `Money: ${rewards.balance}\n` : ""}${rewards.exp ? `Exp: ${rewards.exp}\n` : ""}${rewards.overflowPass ? "1 Free Overflow Pass" : ""}`
                }
            ]
        }), client, message);
        const webhook = new discord.WebhookClient(voteLog.id, voteLog.token);
        webhook.send({
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL(),
            embeds: [
                PixelPizza.createEmbed({
                    color: PixelPizza.colors.blue.hex,
                    title: `**Rewards claimed**`,
                    description: `${message.author.username} has claimed their rewards for voting`,
                    fields: [
                        {
                            name: "Rewards",
                            value: `${rewards.balance ? `Money: ${rewards.balance}\n` : ""}${rewards.exp ? `Exp: ${rewards.exp}\n` : ""}${rewards.overflowPass ? "1 Free Overflow Pass" : ""}`
                        }
                    ]
                })
            ]
        });
    }
}