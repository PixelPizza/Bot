const gis = require('g-i-s');
const { createEmbed, sendEmbed } = require('../functions');
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
                if(client.canSendEmbeds){
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
                                value: `${result.width} pixels`
                            }, 
                            {
                                name: `Height`,
                                value: `${result.height} pixels`
                            }
                        ]
                    }));
                } else {
                    pages.push(result.url);
                }
            });
            message.channel.send(pages[0]).then(msg => msg.react('⏪').then(() => msg.react('⏩').then(() => {
                let page = 0;
                msg.createReactionCollector((reaction, user) => message.author.id === user.id && ['⏪', '⏩'].includes(reaction.emoji.name)).on('collect', (reaction) => {
                    switch(reaction.emoji.name){
                        case '⏪':
                            if(page == 0){
                                page = pages.length-1;
                            } else {
                                page--;
                            }
                            break;
                        case '⏩':
                            if(page == pages.length-1){
                                page = 0;
                            } else {
                                page++;
                            }
                            break;
                        default:
                            return;
                    }
                    msg.edit(pages[page]).then(() => msg.reactions.removeAll().then(() => msg.react('⏪').then(() => msg.react('⏩'))));
                });
            })));
        });
    }
}