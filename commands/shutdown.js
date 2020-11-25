module.exports = {
    name: "shutdown",
    description: "shut the bot down",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        message.channel.send("lol no");
    }
}