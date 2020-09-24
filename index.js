const {Client}=require('discord.js');
const client=new Client();
const {token,prefix,botGuild}=require('./config.json');
const {green,red}=require('./colors.json');
const {updateMemberSize,updateGuildAmount,sendGuildLog,createEmbed}=require('./functions');

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

client.login(token);