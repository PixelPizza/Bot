const fs = require('fs');
const {Client,Collection}=require('discord.js');
const client=new Client();
const {token,prefix,botGuild}=require('./config.json');
const {blue,green,red,black}=require('./colors.json');
const {noice,noice2}=require('./emojis.json');
const {text}=require('./channels.json');
const {developer,worker,teacher,staff,director}=require('./roles.json');
const {updateMemberSize,updateGuildAmount,sendGuildLog,createEmbed,checkNoiceBoard}=require('./functions');
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands=new Collection();
const cooldowns=new Collection();
client.worker=false;
client.teacher=false;
client.staff=false;
client.director=false;

for (let file of cmdFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

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
    let clientMember;
    client.canSendEmbeds = true;
    if (message.guild){
        clientMember = message.guild.members.cache.get(client.user.id);
        if (!clientMember.hasPermission("EMBED_LINKS")) client.canSendEmbeds = false;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    console.log(commandName);
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    let embedMsg = createEmbed(blue,null,null,{name:message.author.username,icon:message.author.displayAvatarURL()}, null, message.author.displayAvatarURL(), [], null, true, {text:client.user.username,icon:client.user.displayAvatarURL()});
    // check if user is blacklisted
    if (message.channel.type == "dm") {
        embedMsg.setColor(red).setDescription("Our commands are unavailable in DMs");
        return message.channel.send(embedMsg);
    }
    if (member){
        worker.forEach(role => {
            if (member.roles.cache.get(role)){
                client.worker = true;
            }
        });
        teacher.forEach(role => {
            if (member.roles.cache.get(role)){
                client.teacher = true;
            }
        });
        staff.forEach(role => {
            if (member.roles.cache.get(role)){
                client.staff = true;
            }
        });
        director.forEach(role => {
            if (member.roles.cache.get(role)){
                client.director = true;
                client.staff = true;
            }
        });
    }
    if (command.userType == "worker" && !client.worker){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza worker to use this command!");
        if (!client.canSendEmbeds) embedMsg = "You need to be Pixel Pizza worker to use this command!";
        return message.channel.send(embedMsg);
    }
    if (command.userType == "teacher" && !client.teacher){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza teacher to use this command!");
        if (!client.canSendEmbeds) embedMsg = "You need to be Pixel Pizza teacher to use this command!";
        return message.channel.send(embedMsg);
    }
    if (command.userType == "staff" && !client.staff){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza staff to use this command!");
        if (!client.canSendEmbeds) embedMsg = "You need to be Pixel Pizza staff to use this command!";
        return message.channel.send(embedMsg);
    }
    if (command.userType == "director" && !client.director){
        embedMsg.setColor(red).setDescription("You need to be Pixel Pizza director to use this command!");
        if (!client.canSendEmbeds) embedMsg = "You need to be Pixel Pizza director to use this command!";
        return message.channel.send(embedMsg);
    }
    let reply;
    if (command.args && !args.length) {
        reply = `There were no arguments given, ${message.author}`;
        if (command.usage) {
            reply += `\nThe proper usage is: '${prefix}${command.name} ${command.usage}'`;
        }
        embedMsg.setColor(red).setTitle('**No arguments**').setDescription(reply);
        if (!client.canSendEmbeds) embedMsg = reply;
        return message.channel.send(embedMsg);
    }
    if (command.args == false && args.length){
        embedMsg.setColor(red).setTitle('**No arguments needed**').setDescription(`This command doesn't require any arguments, ${message.author}`);
        if (!client.canSendEmbeds) embedMsg = `This command doesn't require any arguments, ${message.author}`;
        return message.channel.send(embedMsg);
    }
    if (command.minArgs && args.length < command.minArgs){
        reply = `${prefix}${command.name} takes a minimum of ${command.minArgs} argument(s)`;
        if (command.usage){
            reply += `\nThe proper usage is ${prefix}${command.name} ${command.usage}`;
        }
        embedMsg.setColor(red).setDescription(reply);
        if (!client.canSendEmbeds) embedMsg = reply;
        return message.channel.send(embedMsg);
    }
    if (command.maxArgs && args.length > command.maxArgs){
        reply = `${prefix}${command.name} takes a maximum of ${command.maxArgs} argument(s)`;
        if (command.usage){
            reply += `The proper usage is ${prefix}${command.name} ${command.usage}`;
        } 
        embedMsg.setColor(red).setDescription(reply);
        if (!client.canSendEmbeds) embedMsg = reply;
        return message.channel.send(embedMsg);
    }
    if (command.neededPerms && command.neededPerms.length){
        for(let index in command.neededPerms){
            let neededPerm = command.neededPerms[index];
            if (!clientMember.hasPermission(neededPerm)){
                let embedMsgError = createEmbed(red, "Missing permission", null, null, `I'm missing the '${neededPerm}' permission`);
                if (!client.canSendEmbeds) embedMsgError = `I'm missing the '${neededPerm}' permission`;
                return message.channel.send(embedMsgError);
            }
        }
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    let cooldownAmount = (command.cooldown || 0) * 1000;
    if (timestamps.has(message.author.id)){
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            embedMsg.setColor(black).setTitle('**Cooldown**').setDescription(`please wait ${timeLeft} more second(s) before reusing ${command.name}`);
            if (!client.canSendEmbeds) embedMsg = `please wait ${timeLeft} more second(s) before reusing ${command.name}`;
            return message.channel.send(embedMsg);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
        command.execute(message, args, client);
        console.log(`${command.name} executed!`);
    } catch (error) {
        console.error(error);
        embedMsg.setColor(red).setTitle('**Error**').setDescription('there was an error trying to execute that command!');
        if (!client.canSendEmbeds) embedMsg = 'there was an error trying to execute that command!';
        message.channel.send(embedMsg);
    }
});

client.login(token);