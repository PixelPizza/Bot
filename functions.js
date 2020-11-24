const { WebhookClient, MessageEmbed, Collection } = require('discord.js');
const { prefix, noiceboardMinValue } = require('./config.json');
const { voice, text } = require("./channels.json");
const { log } = require('./webhooks.json');
const { noice2 } = require('./emojis.json');
const { noiceboard } = require('./colors.json');
const { levelRoles } = require('./roles.json');
const { isUri } = require('valid-url');
const https = require('https');
const http = require('http');
const {URL} = require('url');

exports.updateMemberSize = client => {
    const [bots, members] = client.guildMembers.partition(member => member.user.bot);
    client.channels.cache.get(voice.allMembers).setName(`All members: ${client.guildMembers.size}`);
    client.channels.cache.get(voice.members).setName(`Members: ${members.size}`);
    client.channels.cache.get(voice.bots).setName(`Bots: ${bots.size}`);
}
exports.updateGuildAmount = client => {
    const activities = ["PLAYING", "STREAMING", "LISTENING", "WATCHING"];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    let serverAmout = client.guilds.cache.array().length;
    let suffixUsed = "";
    for (let suffix in ["k", "m", "b"]) {
        if (serverAmout > 1000) {
            serverAmout /= 1000;
            suffixUsed = suffix;
        } else break;
    }
    serverAmout += suffixUsed;
    serverAmout = activity == "PLAYING" || activity == "STREAMING" ? `with ${serverAmout}` : serverAmout;
    client.user.setActivity(`${serverAmout} guilds | ${prefix}help | v1.0`, { type: activity, url: "http://twitch.tv/" });
}
exports.sendGuildLog = async (name, avatar, message) => {
    const webhook = new WebhookClient(log.id, log.token);
    await webhook.edit({ name: name, avatar: avatar });
    webhook.send(message);
}
exports.createEmbed = (options = { color: "", title: "", url: "", author: { name: "", icon: "", url: "" }, description: "", thumbnail: "", fields: [{ name: "", value: "", inline: false }], image: "", timestamp: false, footer: { text: "", icon: "" } }) => this.editEmbed(new MessageEmbed(), options);
exports.editEmbed = (embedMsg, options = { color: "", title: "", url: "", author: { name: "", icon: "", url: "" }, description: "", thumbnail: "", fields: [{ name: "", value: "", inline: false }], image: "", timestamp: false, footer: { text: "", icon: "" } }) => {
    if (options.color) embedMsg.setColor(options.color);
    if (options.title) embedMsg.setTitle(options.title);
    if (options.url) embedMsg.setURL(options.url);
    if (options.author?.name) embedMsg.setAuthor(options.author.name, options.author.icon, options.author.url);
    if (options.description) embedMsg.setDescription(options.description);
    if (options.thumbnail) embedMsg.setThumbnail(options.thumbnail);
    for (let index in options.fields) {
        const field = options.fields[index];
        if (field.name && field.value) embedMsg.addField(field.name, field.value, field.inline);
    }
    if (options.image) embedMsg.setImage(options.image);
    if (options.timestamp) embedMsg.setTimestamp();
    if (options.footer?.text) embedMsg.setFooter(options.footer.text, options.footer.icon);
    return embedMsg;
}
exports.checkNoiceBoard = messageReaction => {
    const guild = messageReaction.message.guild;
    const member = messageReaction.message.member;
    const channel = guild.channels.cache.get(text.noiceboard);
    const emoji = guild.emojis.cache.get(noice2);
    const embedMsg = this.createEmbed({
        color: noiceboard,
        author: {
            name: member.displayName,
            icon: member.user.displayAvatarURL()
        },
        description: messageReaction.message.content,
        fields: [{
            name: "Message",
            value: `[Jump to message](${messageReaction.message.url})`
        }],
        timestamp: true,
        footer: { text: messageReaction.message.id }
    });
    const message = channel.messages.cache.find(m => m.embeds[0].footer.text === messageReaction.message.id);
    if (messageReaction.count >= noiceboardMinValue) {
        const messageText = `${emoji} ${messageReaction.count} ${messageReaction.message.channel}`;
        if (!message) {
            return channel.send(messageText, embedMsg);
        }
        message.edit(messageText, embedMsg);
    } else if (message) {
        message.delete();
    }
}
exports.sendEmbed = (embed, message) => message.channel.send(message.client.canSendEmbeds ? embed : embed.description);
exports.sendEmbedWithChannel = (embed, client, channel) => channel.send(client.canSendEmbeds ? embed : embed.description);
exports.addRole = (member, role) => member.roles.add(role);
exports.removeRole = (member, role) => member.roles.remove(role);
exports.hasRole = (member, role) => member.roles.cache.has(role);
exports.isVip = (member) => member.roles.cache.has(levelRoles.hundered);
exports.randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
exports.getUser = (message, args, client) => (message.mentions.users.first() || client.users.cache.find(user => user.id == args[0] || user.username.toLowerCase().includes(args.join(" ").toLowerCase()))) || client.guildMembers.find(member => member.displayName.toLowerCase().includes(args.join(" ").toLowerCase()))?.user;
exports.getGuild = (args, client) => client.guilds.cache.find(guild => guild.id == args.join(" ") || guild.name.toLowerCase().includes(args.join(" ").toLowerCase()));
exports.inBotGuild = (client, userId) => Boolean(client.guildMembers.get(userId));
exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms));
exports.isImage = url => isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);
exports.capitalize = string => string.charAt(0).toUpperCase() + string.substring(1);
exports.setCooldown = (client, commandName, userId, seconds) => {
    if (!client.cooldowns.has(commandName)) {
        client.cooldowns.set(commandName, new Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(commandName);
    const ms = seconds * 1000;
    if (!timestamps.has(userId) || now >= timestamps.get(userId) + ms){
        timestamps.set(userId, now + ms);
        setTimeout(() => timestamps.delete(userId), ms);
    }
}
exports.request = (url, method = "GET") => new Promise((resolve, reject) => {
    if(!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) return;
    const newUrl = new URL(url);
    const protocol = newUrl.protocol === "https:" ? https : http;
    protocol.request({
        hostname: newUrl.hostname,
        path: newUrl.pathname,
        method: method
    }, resolve).on('error', reject).end();
});
