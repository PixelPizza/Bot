const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const { query } = require("../dbfunctions");
const { sendEmbed, createEmbed, capitalize, editEmbed } = PixelPizza;
const { blue, red } = PixelPizza.colors;

module.exports = {
    name: "workers",
    description: "shows all Pixel Pizza workers",
    args: false,
    cooldown: 600,
    userType: "staff",
    neededPerms: [],
    pponly: true,
    removeExp: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        const workers = await query("SELECT * FROM worker");
        const pages = [];
        for(let worker of workers){
            if(!client.guildMembers.has(worker.workerId)) continue;
            const member = client.guildMembers.get(worker.workerId);
            if(client.canSendEmbeds){
                pages.push(createEmbed({
                    color: blue.hex,
                    title: member.displayName,
                    fields: [
                        {
                            name: "id",
                            value: member.id
                        }
                    ]
                }));
            } else {
                pages.push(`${member.displayName}\n\n**Id**\n${member.id}`);
            }
        }
        if(!pages.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "No workers have been found"
            }), client, message);
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
    }
}