const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, getUser, makeRankImg } = PixelPizza; 
const { red, levels } = PixelPizza.colors; 
const { query } = require("../dbfunctions"); 
const { MessageAttachment } = require('discord.js'); 

module.exports = { 
    name: "rank", 
    description: "see your or someone elses rank", 
    aliases: ["level"], 
    minArgs: 0, 
    usage: "[user]", 
    cooldown: 5, 
    userType: "all", 
    neededPerms: [], 
    pponly: false, 
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red.hex,
            title: "User not found",
            description: "Could not find user"
        });
        let user = message.author; 
        if (args.length) { 
            user = getUser(message, args, client);
            if (!user) { 
                return sendEmbed(embedMsg, client, message); 
            } 
        } 
        let style = {}; 
        let results = await query("SELECT userId, `exp`, `level`, styleBack, styleFront, styleExpBack, styleExpFront FROM `user` ORDER BY `level` DESC, exp DESC"); 
        let rank = 0; 
        let attachment = embedMsg; 
        for (let result of results) { 
            rank++; 
            if (result.userId != user.id) continue; 
            style.back = result.styleBack ?? levels.back.hex; 
            style.front = result.styleFront ?? levels.front.hex; 
            style.expBack = result.styleExpBack ?? levels.expback.hex; 
            style.expFront = result.styleExpFront ?? levels.expfront.hex; 
            const image = await makeRankImg(user, result.level, result.exp, rank, style); 
            attachment = new MessageAttachment(image.toBuffer(), "rank.png"); 
            break; 
        } 
        message.channel.send({files: [attachment]}); 
    } 
}