const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");

module.exports = {
    name: "ap",
    description: "ppap",
    aliases: [],
    args: false,
    minArgs: 0,
    maxArgs: 0,
    usage: "",
    cooldown: 30,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    hidden: true,
    /**
     * Execute this command
     * @param {discord.Message} message
     * @param {string[]} args
     * @param {PixelPizza.PPClient} client
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const clientMember = message.guild.me;
        if(message.member.voice.channel && message.member.voice.channel.permissionsFor(clientMember).has(discord.Permissions.FLAGS.MUTE_MEMBERS)){
            clientMember.voice.setMute(false);
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play("audio/ppap.mp3");
            dispatcher.on('start', () => {
                PixelPizza.sendEmbed(PixelPizza.createEmbed({
                    color: PixelPizza.colors.blue.hex,
                    title: "PPAP",
                    description: "Are you sure you want this?"
                }), client, message);
            });
            dispatcher.on('error', console.error);
            dispatcher.on('finish', () => connection.disconnect());
        } else {
            PixelPizza.sendEmbed(PixelPizza.createEmbed({
                color: PixelPizza.colors.yellow.hex,
                title: "PPAP",
                description: "https://www.youtube.com/watch?v=Ct6BUPvE2sM"
            }), client, message);
        }
    }
}