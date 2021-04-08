const { sendEmbed, createEmbed, colors, PPClient, config } = require("pixel-pizza")

module.exports = {
    name: "canary",
    description: "Info about canary version",
    aliases: ["test"],
    args: false,
    cooldown: 0,
    userType: "all",
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const guild = await client.guilds.fetch(config.botGuild);
        const invite = await guild.systemChannel.createInvite({maxAge: 0, maxUses: 0, unique: false});
        sendEmbed(createEmbed({
            color: colors.blue.hex,
            title: "Canary test version",
            description: [
                "Do you want to test new features of Pixel Pizza?",
                `Join our server: ${invite}`,
                "And use !pphelp for the commands"
            ]
        }), client, message);
    }
}