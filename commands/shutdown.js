module.exports = {
    name: "shutdown",
    description: "shut the bot down",
    args: false,
    cooldown: 100000000000,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        message.channel.send("I don't think so... don't try again");
    }
}