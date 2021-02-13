const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const {query} = require('../dbfunctions');

module.exports = {
    name: "addvip",
    description: "add vip to a user",
    args: true,
    minArgs: 1,
    usage: "<user>",
    cooldown: 0,
    userType: "maker",
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
        const embedMsg = PixelPizza.createEmbed({
            color: PixelPizza.colors.red.hex,
            title: "**Add vip**"
        });
        const user = PixelPizza.getUser(message, args, client);
        if(!user){
            return await PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: "User could not be found"
            }), client, message);
        }
        const member = client.guildMembers.get(user.id);
        if(!member){
            return await PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
                description: "This user is not in Pixel Pizza"
            }), client, message);
        }
        await query("INSERT INTO vipException (userId) VALUES(?) ON DUPLICATE KEY UPDATE userId = VALUES(userId)", [user.id]);
        await member.roles.add(PixelPizza.roles.levelRoles.hundered);
        PixelPizza.sendEmbed(PixelPizza.editEmbed(embedMsg, {
            color: PixelPizza.colors.green.hex,
            description: `Succesfully made ${user} vip`
        }), client, message);
    }
}