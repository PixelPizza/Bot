const { createEmbed, sendEmbed, getUser } = require("../functions"); 
const { red, levels } = require('../colors.json'); 
const { query } = require("../dbfunctions"); 
const { makeRankImg } = require("../canvasfunctions"); 
const { MessageAttachment } = require('discord.js'); 

module.exports = { 
    name: "rank", 
    description: "see your or someone elses rank", 
    aliases: ["level"], 
    minArgs: 0, 
    usage: "[user]", 
    cooldown: 60, 
    userType: "all", 
    neededPerms: [], 
    pponly: false, 
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
            title: "User not found",
            description: "Could not find user"
        });
        let user = message.author; 
        if (args.length) { 
            user = getUser(message, args, client);
            if (!user) { 
                return sendEmbed(embedMsg, message); 
            } 
        } 
        let style = {}; 
        let results = await query("SELECT userId, `exp`, `level`, styleBack, styleFront, styleExpBack, styleExpFront FROM `user` ORDER BY `level` DESC, exp DESC"); 
        let rank = 0; 
        let attachment = embedMsg; 
        for (let result of results) { 
            rank++; 
            if (result.userId != user.id) continue; 
            style.back = result.styleBack ?? levels.back; 
            style.front = result.styleFront ?? levels.front; 
            style.expBack = result.styleExpBack ?? levels.exp_back; 
            style.expFront = result.styleExpFront ?? levels.exp_front; 
            const image = await makeRankImg(user, result.level, result.exp, rank, style); 
            attachment = new MessageAttachment(image.toBuffer(), "rank.png"); 
            break; 
        } 
        message.channel.send(attachment); 
    } 
}