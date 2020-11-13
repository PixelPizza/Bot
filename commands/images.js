const gis = require('g-i-s');
const { createEmbed, isImage } = require('../functions');
const { blue } = require('../colors.json');
const { restricedDomains } = require('../config.json');

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
        message.channel.send('Searching for images').then(msg => {
            gis({
                searchTerm: args.join(' '),
                filterOutDomains: restricedDomains
            }, (error, results) => {
                if(error) throw error;
                const pages = [];
                results.forEach((result) => {
                    if(!isImage(result.url)) return;
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
                                    value: `${result.width} pixels`,
                                    inline: true
                                }, 
                                {
                                    name: `Height`,
                                    value: `${result.height} pixels`,
                                    inline: true
                                }
                            ]
                        }));
                    } else {
                        pages.push(result.url);
                    }
                });
                if(!pages.length) return message.edit("Could not find any images");
                msg.delete();
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
        });
    }
}