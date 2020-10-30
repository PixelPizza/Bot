const { createEmbed, sendEmbed, editEmbed } = require("../functions"); 
const { red, blue } = require('../colors.json'); 
const { query } = require("../dbfunctions"); 

module.exports = { 
    name: "leaderboard", 
    description: "see the pixel pizza ranking leaderboard", 
    aliases: ["lb", "rankings"], 
    minArgs: 0, 
    maxArgs: 1, 
    usage: "[page]", 
    cooldown: 0, 
    userType: "all", 
    neededPerms: [], 
    pponly: false, 
    async execute(message, args, client) { 
        const reactions = ['⬅️', '➡️']; 
        let embedMsg = createEmbed({
            color: red,
            title: `Not a number`,
            description: `${args[0]} is not a number`
        });
        if (args.length && isNaN(parseInt(args[0]))) return sendEmbed(embedMsg, message); 
        const pages = []; 
        let page = 0; 
        let name = this.name; 
        const addPage = () => { 
            const embedMsg = createEmbed({
                color: blue,
                title: `**${name}**`,
                description: "```md\n",
                footer: {
                    text: `Page ${page + 1}`
                }
            });
            pages.push(embedMsg); 
        } 
        addPage(); 
        let rank = 0; 
        let itemNumber = 0; 
        const results = await query("SELECT userId FROM `user` ORDER BY `level` DESC, exp DESC, userId"); 
        if (!results.length) {
            return sendEmbed(editEmbed(embedMsg, {
                color: blue,
                title: `**${this.name}**`,
                description: `There are no users in the leaderboard`
            })); 
        }
        for (let result of results) { 
            itemNumber++; 
            console.log(client.guild.members.cache);
            let member = client.guild.members.cache.get(result.userId); 
            if (!member) {
                if(itemNumber == results.length) pages[page].description += "```";
                continue;
            }
            rank++; 
            let user = member.user; 
            let rankString = `#${rank} • ${user.username}\n`; 
            if (rank % 10 == 0 || itemNumber == results.length) rankString += "```"; 
            pages[page].description += rankString; 
            if (rank % 10 == 0 && itemNumber != results.length) { 
                page++; 
                addPage(); 
            } 
        } 
        page = args.length ? args[0] : 1;
        embedMsg = editEmbed(embedMsg, {
            color: red,
            title: "Page not found"
        });
        if (page < 1) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `Please use a page number higher than 0`
            }), message);
        } 
        if (pages.length < page) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `page ${page} doesn't exist\nThere are ${pages.length} pages`
            }), message);
        } 
        sendEmbed(pages[page - 1], message).then(msg => { 
            msg.react(reactions[0]).then(() => msg.react(reactions[1]).then(() => { 
                msg.createReactionCollector((reaction, user) => user.id === message.author.id && reactions.includes(reaction.emoji.name)).on('collect', r => { 
                    switch (r.emoji.name) { 
                        case reactions[0]: 
                            if (page == 1) page = pages.length; 
                            else page--; 
                        break; 
                        case reactions[1]: 
                            if (page == pages.length) page = 1; 
                            else page++; 
                        break; 
                        default: return; 
                    }
                    let newPage = pages[page - 1]; 
                    if (!client.canSendEmbeds) newPage = newPage.description; 
                    msg.edit(newPage); 
                    msg.reactions.removeAll(); 
                    msg.react(reactions[0]).then(() => msg.react(reactions[1])); 
                }); 
            })); 
        }); 
    } 
}