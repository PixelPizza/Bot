const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");
const {query} = require('../dbfunctions');

module.exports = {
    name: "shop",
    description: "Look at the items in the shop",
    aliases: [],
    minArgs: 0,
    maxArgs: 1,
    usage: "[page]",
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    /**
     * 
     * @param {discord.MessageEmbed[]} pages 
     */
    addPage: (pages, command) => {
        pages.push(PixelPizza.createEmbed({
            color: PixelPizza.colors.blue.hex,
            title: `**${PixelPizza.capitalize(command.name)}**`,
            footer: {
                text: `Page ${pages.length+1}`
            }
        }));
        return pages.length-1;
    },
    /**
     * Execute this command
     * @param {discord.Message} message
     * @param {string[]} args
     * @param {PixelPizza.PPClient} client
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const items = await query("SELECT * FROM item ORDER BY itemId");
        if(!items.length){
            return PixelPizza.sendEmbed(PixelPizza.createEmbed({
                color: PixelPizza.colors.blue.hex,
                title: `**${PixelPizza.capitalize(this.name)}**`,
                description: "No items have been found"
            }), client, message);
        }
        /** @type {discord.MessageEmbed[]} */
        const pages = [];
        let page = 0;

        items.forEach((item, index) => {
            if(index % 25 == 0) page = this.addPage(pages, this);
            pages[page].addField(item.name, `${item.description}\n${PixelPizza.getEmoji(client.guild, PixelPizza.config.currency)} ${item.price}\nstock ${item.stock != -1 ? item.stock : "∞"}`);
        });

        page = args.length ? parseInt(args[0]) : 1;
        
        PixelPizza.sendEmbed(pages[page-1], client, message).then(async msg => {
            const reactions = ["⏮", "⏪", "⏹", "⏩", "⏭"];
            for(let reaction of reactions){
                await msg.react(reaction);
            }
            const collector = msg.createReactionCollector((reaction, user) => user == message.author && reactions.includes(reaction.emoji.name));
            collector.on('collect', async (reaction) => {
                switch(reaction.emoji.name){
                    case reactions[0]:
                        page = 1;
                        break;
                    case reactions[1]:
                        page = page == 1 ? pages.length : page - 1;
                        break;
                    case reactions[2]:
                        pages[page].fields = [];
                        pages[page].footer.text = "";
                        msg.edit(PixelPizza.editEmbed(pages[page], {
                            color: PixelPizza.colors.green.hex,
                            description: "The shop is closed"
                        }));
                        msg.reactions.removeAll();
                        return collector.stop("user reacted with ⏹ to close the shop");
                    case reactions[3]:
                        page = page == pages.length ? 1 : page + 1;
                        break;
                    case reactions[4]:
                        page = pages.length;
                        break;
                }
                msg.edit(pages[page-1]);
                msg.reactions.removeAll();
                for(let reaction of reactions){
                    await msg.react(reaction);
                }
            });
        });
    }
}