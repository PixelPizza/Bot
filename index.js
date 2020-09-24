const {Client,Collection}=require('discord.js');
const client=new Client();
const {token,prefix,botGuild}=require('./config.json');
const {blue,green,red}=require('./colors.json');
const {noice,noice2}=require('./emojis.json');
const {text}=require('./channels.json');
const {developer,worker,teacher,staff,director}=require('./roles.json');
const {updateMemberSize,updateGuildAmount,sendGuildLog,createEmbed,checkNoiceBoard}=require('./functions');
client.commands=new Collection();

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
    const guild = client.guilds.cache.get(botGuild);
    const member = guild.members.cache.get(message.author.id);
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
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot || message.webhookID) return;
    if (message.guild){
        const clientMember = message.guild.members.cache.get(client.user.id);
        if (!clientMember.hasPermission("CREATE_INSTANT_INVITE")){
            const embedMsgError = createEmbed(red, "Missing permission", null, null, "I'm missing the `CREATE_INSTANT_INVITE` permission");
            return message.channel.send(embedMsgError);
        }
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    console.log(commandName);
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    const embedMsg = createEmbed(blue,null,null,{name:message.author.username,icon:message.author.displayAvatarURL()}, null, message.author.displayAvatarURL(), [], null, true, {text:client.user.username,icon:client.user.displayAvatarURL()});
    // check if user is blacklisted
    if (message.channel.type == "dm") {
        embedMsg.setColor(red).setDescription("Our commands are unavailable in DMs");
        return message.channel.send(embedMsg);
    }
    let workerBool = false;
    let teacherBool = false;
    let staffBool = false;
    let directorBool = false;
    if (member){
        worker.forEach(role => {
            if (member.roles.cache.get(role)){
                workerBool = true;
            }
        });
        teacher.forEach(role => {
            if (member.roles.cache.get(role)){
                teacherBool = true;
            }
        });
        staff.forEach(role => {
            if (member.roles.cache.get(role)){
                staffBool = true;
            }
        });
        director.forEach(role => {
            if (member.roles.cache.get(role)){
                directorBool = true;
            }
        });
    }
    if (command.userType == "worker" && !workerBool){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza worker to use this command!");
        return message.channel.send(embedMsg);
    }
    if (command.userType == "teacher" && !teacherBool){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza teacher to use this command!");
        return message.channel.send(embedMsg);
    }
    if (command.userType == "staff" && !staffBool){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza staff to use this command!");
        return message.channel.send(embedMsg);
    }
    if (command.userType == "director" && !directorBool){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza director to use this command!");
        return message.channel.send(embedMsg);
    }
    if (command.args && !args.length) {
        let reply = `There were no arguments given, ${message.author}`;
        if (command.usage) {
            reply += `\nThe proper usage is: '${prefix}${command.name} ${command.usage}'`;
        }
        embedMsg.setColor(red).setTitle('**No arguments**').setDescription(reply);
        return message.channel.send(embedMsg);
    }
    if (command.args == false && args.length){
        embedMsg.setColor(red).setTitle('**No arguments needed**').setDescription(`This command doesn't require any arguments, ${message.author}`);
        return message.channel.send(embedMsg);
    }
});

client.login(token);