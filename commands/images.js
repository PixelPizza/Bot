const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const gis = require('g-i-s');
const { createEmbed, isImage, request } = PixelPizza;
const { blue } = PixelPizza.colors;
const { restricedDomains } = PixelPizza.config;

module.exports = {
    name: "images",
    description: "search for images",
    aliases: [],
    args: true,
    minArgs: 1,
    usage: "<search> [{max: max}]",
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const selection = /^.*?({max:(?<max>.+?)})$/.exec(message);
        let max = 0;
        if(selection){
            max = !isNaN(parseInt(selection.groups.max)) ? parseInt(selection.groups.max) : max;
            args.reverse();
            args.splice(0, selection[1].split(/ +/).length);
            args.reverse();
        }
        message.channel.send('Searching for images\nThis may take some time depending on the amount of results').then(msg => {
            let index = 0;
            gis({
                searchTerm: args.join(' '),
                filterOutDomains: restricedDomains
            }, async (error, results) => {
                if(error) throw error;
                const pages = [];
                for(let result of results){
                    let response;
                    try {
                        response = await request(result.url);
                    } catch (error) {
                        console.log(error);
                        continue;
                    }
                    if(!isImage(result.url) || response.statusCode != 200 || (max && index >= max)) continue;
                    index++;
                    if(client.canSendEmbeds){
                        pages.push(createEmbed({
                            color: blue.hex,
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
                }
                if(!pages.length) return msg.edit("Could not find any images");
                msg.delete();
                for(let index in pages){
                    pages[index].setFooter(`results: ${pages.length} | result: ${parseInt(index)+1}`);
                }
                message.channel.send(pages[0]).then(msg => {
                    if(pages.length == 1) return;
                    msg.react('⏪').then(() => msg.react('⏩').then(() => {
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
                    }));
                });
            });
        });
    }
}