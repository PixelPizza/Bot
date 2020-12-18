const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed } = PixelPizza;
const { blue } = PixelPizza.colors;

module.exports = {
    name: "servers",
    description: "show all servers the bot is in",
    aliases: ["serverslist", "guilds"],
    args: false,
    cooldown: 120,
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
        const pages = [];
        client.guilds.cache.each(guild => {
            pages.push(createEmbed({
                color: blue.hex,
                title: "**Server**",
                description: guild.name,
                fields: [
                    {
                        name: "Members",
                        value: guild.memberCount
                    }
                ],
                footer: {
                    text: `total guilds: ${client.guilds.cache.size}`
                }
            }));
        });
        sendEmbed(pages[0], client, message).then(msg => {
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