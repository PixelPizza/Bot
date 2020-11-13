const gis = require('g-i-s');
const { createEmbed } = require('../functions');
const { blue } = require('../colors.json');

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
            if(error) throw error;
            const pages = [];
            results.forEach((result) => {
                pages.push(createEmbed({
                    color: blue,
                    title: `**Image**`,
                    description: args.join(" "),
                    image: result.url,
                    fields: [
                        {
                            name: `URL`,
                            value: result.url
                        }, 
                        {
                            name: `Width`,
                            value: result.width
                        }, 
                        {
                            name: `Height`,
                            value: result.height
                        }
                    ]
                }));
            });
            console.log(pages);
            message.channel.send(pages[0]);
        });
    }
}