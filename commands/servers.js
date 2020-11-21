const { createEmbed, sendEmbed } = require("../functions");
const { blue } = require('../colors.json');

module.exports = {
    name: "servers",
    description: "show all servers the bot is in",
    aliases: ["serverslist"],
    args: false,
    cooldown: 120,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const pages = [];
        client.guilds.cache.each(guild => {
            pages.push(createEmbed({
                color: blue,
                title: "**Server**",
                description: guild.name,
                fields: [
                    {
                        name: "Members",
                        value: guild.memberCount
                    }
                ]
            }));
        });
        sendEmbed(pages[0], message).then(msg => {
            if(pages.length == 1) return;
            msg.react("⏪").then(() => msg.react("⏩").then(() => {
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
    }
}