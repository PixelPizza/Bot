const {Client}=require('discord.js');
const client=new Client();
const {token,prefix,botGuild}=require('./config.json');
const {green,red}=require('./colors.json');
const {noice,noice2}=require('./emojis.json');
const {text}=require('./channels.json');
const {developer}=require('./roles.json');
const {updateMemberSize,updateGuildAmount,sendGuildLog,createEmbed,checkNoiceBoard}=require('./functions');

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.on('error', error => {
    console.error('The websocket connection encountered an error:', error);
});

client.on('ready', () => {
    updateGuildAmount(client);
    updateMemberSize(client);
    console.log("Pixel Pizza is ready");
});

client.on('guildCreate', guild => {
    updateGuildAmount(client);
    sendGuildLog(guild.name, guild.iconURL(), createEmbed(green, "Added", null, null, `${client.user.username} has been added to the guild ${guild.name}`, null, [], null, true, {text: guild.id}));
    let channel = guild.systemChannel;
    if (!channel){
        channel = guild.channels.cache.find(channel => channel.type === "text");
    }
    channel.send(createEmbed(green, "Thank you!", null, null, `Thank you for adding me!\nMy prefix is ${prefix}\nUse ${prefix}help for all commands!`));
});

client.on('guildDelete', guild => {
    updateGuildAmount(client);
    sendGuildLog(guild.name, guild.iconURL(), createEmbed(red, "Removed", null, null, `${client.user.username} has been removed from the guild ${guild.name}`, null, [], null, true, {text: guild.id}));
});

client.on('guildMemberAdd', member => {
    if (member.guild.id !== botGuild) return;
    updateMemberSize(client);
});

client.on('guildMemberRemove', member => {
    if (member.guild.id !== botGuild) return;
    updateMemberSize(client);
});

client.on('messageReactionAdd', messageReaction => {
    if (messageReaction.message.guild.id !== botGuild || messageReaction.emoji.id !== noice2) return;
    checkNoiceBoard(messageReaction);
});

client.on('messageReactionRemove', messageReaction => {
    if (messageReaction.message.guild.id !== botGuild || messageReaction.emoji.id !== noice2) return;
    checkNoiceBoard(messageReaction);
});

client.on('message', message => {
    if (message.channel.id === text.logs && !message.webhookID){
        return message.delete();
    }
    if (message.channel.id === text.updates && message.member){
        if (!message.member.roles.cache.get(developer)){
            message.delete();
        }
    }
    // add exp and check level roles
    if (message.content.toLowerCase().includes('noice')) {
        message.react(noice).then(console.log).catch(console.error);
    }
    if (!message.content.toLowerCase().startsWith(prefix)) return;
});

client.login(token);