const gis = require('g-i-s');

module.exports = {
    name: "images",
    description: "search for images",
    aliases: [],
    args: true,
    minArgs: 1,
    usage: "<search>",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    needVip: false,
    async execute(message, args, client) {
        gis(args.join(' '), (error, results) => {
            message.channel.send(results.slice(0, 20).map(result => result.url).join("\n"));
        });
    }
}