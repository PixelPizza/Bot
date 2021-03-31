const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");

module.exports = {
    name: "totalusers",
    description: "show total users",
    aliases: ["total"],
    args: false,
    minArgs: 0,
    maxArgs: 0,
    cooldown: 0,
    userType: "staff",
    neededPerms: [],
    pponly: true,
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
        message.channel.send(client.users.cache.size);
    }
}