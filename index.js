const {Client}=require('discord.js');
const client=new Client();
const {token}=require('./config.json');
const {green}=require('./colors.json');
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
});

client.login(token);