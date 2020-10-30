const{WebhookClient,MessageEmbed}=require('discord.js');
const{prefix,noiceboardMinValue}=require('./config.json');
const{voice,text}=require("./channels.json");
const{log}=require('./webhooks.json');
const{noice2}=require('./emojis.json');
const{noiceboard}=require('./colors.json');
const{isUri}=require('valid-url');

exports.updateMemberSize = client => {
    const guild=client.guild;
    const bots=client.guildMembers.filter(member=>member.user.bot).size;
    client.channels.cache.get(voice.allMembers).setName(`All members: ${guild.memberCount}`);
    client.channels.cache.get(voice.members).setName(`Members: ${guild.memberCount - bots}`);
    client.channels.cache.get(voice.bots).setName(`Bots: ${bots}`);
}
exports.updateGuildAmount = client => {
    const activities = ["PLAYING","STREAMING","LISTENING","WATCHING"];
    const activity = activities[Math.floor(Math.random()*activities.length)];
    let serverAmout = client.guilds.cache.array().length;
    let suffixUsed = "";
    for(let suffix in ["k","m","b"]){
        if(serverAmout > 1000){
            serverAmout /= 1000;
            suffixUsed = suffix;
        } else break;
    }
    serverAmout += suffixUsed;
    serverAmout = activity == "PLAYING" || activity == "STREAMING" ? `with ${serverAmout}` : serverAmout;
    client.user.setActivity(`${serverAmout} guilds | ${prefix}help`,{type:activity,url:"http://twitch.tv/"});
}
exports.sendGuildLog = async (name, avatar, message) => {
    const webhook = new WebhookClient(log.id, log.token);
    await webhook.edit({name:name, avatar:avatar});
    webhook.send(message);
}
exports.createEmbed = (options = {color: "", title: "", url: "", author: {name: "", icon: "", url: ""}, description: "", thumbnail: "", fields: [{name: "", value: "", inline: false}], image: "", timestamp: false, footer: {text: "", icon: ""}}) => this.editEmbed(new MessageEmbed(), options);
exports.editEmbed = (embedMsg, options = {color: "", title: "", url: "", author: {name: "", icon: "", url: ""}, description: "", thumbnail: "", fields: [{name: "", value: "", inline: false}], image: "", timestamp: false, footer: {text: "", icon: ""}})=>{
    if(options.color) embedMsg.setColor(options.color);
    if(options.title) embedMsg.setTitle(options.title);
    if(options.url) embedMsg.setURL(options.url);
    if(options.author?.name) embedMsg.setAuthor(options.author.name, options.author.icon, options.author.url);
    if(options.description) embedMsg.setDescription(options.description);
    if(options.thumbnail) embedMsg.setThumbnail(options.thumbnail);
    for(let index in options.fields){
        const field = options.fields[index];
        if(field.name && field.value) embedMsg.addField(field.name, field.value, field.inline);
    }
    if(options.image) embedMsg.setImage(options.image);
    if(options.timestamp) embedMsg.setTimestamp();
    if(options.footer?.text) embedMsg.setFooter(options.footer.text, options.footer.icon);
    return embedMsg;
}
exports.checkNoiceBoard = messageReaction => {
    const guild = messageReaction.message.guild;
    const member = messageReaction.member.member;
    const channel = guild.channels.cache.get(text.noiceboard);
    const emoji = guild.emojis.cache.get(noice2);
    const embedMsg = this.createEmbed({
        color: noiceboard,
        author: {
            name: member.displayName,
            icon:member.user.displayAvatarURL
        },
        description: messageReaction.message.content,
        fields: [{
            name: "Message",
            value: `[Jump to message](${messageReaction.message.url})`
        }],
        timestamp: true,
        footer: {text: messageReaction.message.id}
    });
    const message = channel.messages.cache.find(m => m.embeds[0].footer.text === messageReaction.message.id);
    if(messageReaction.count >= noiceboardMinValue){
        const messageText = `${emoji} ${messageReaction.count} ${messageReaction.message.channel}`;
        if(!message){
            return channel.send(messageText,embedMsg);
        }
        message.edit(messageText, embedMsg);
    } else if(message){
        message.delete();
    }
}
exports.sendEmbed = (embed, message) => message.channel.send(message.client.canSendEmbeds ? embed : embed.description);
exports.sendEmbedWithChannel = (embed, client, channel) => channel.send(client.canSendEmbeds ? embed : embed.description);
exports.addRole = (member, role) => member.roles.add(role);
exports.removeRole = (member, role) => member.roles.remove(role);
exports.hasRole = (member, role) => Boolean(member.roles.cache.get(role));
exports.randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
exports.getUser = (message, args, client) => {
    let user = null;
    if(message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if(!isNaN(parseInt(args[0]))) {
        user = client.users.cache.get(args[0]);
    } else {
        user = client.users.cache.find(u => u.username.toLowerCase().includes(args.toString().replace(",", " ").toLowerCase()));
    }
    return user;
}
exports.inBotGuild = (client, userId) => Boolean(client.guildMembers.get(userId));
exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms));
exports.isImage = url => isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);
exports.capitalize = string => string.charAt(0).toUpperCase() + string.substring(1);
