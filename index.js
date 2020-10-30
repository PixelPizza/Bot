const fs = require('fs');
const { Client, Collection } = require('discord.js');
const client = new Client();
const { token, prefix, botGuild } = require('./config.json');
/* 
colors I use:
* notice: gray / lightgray
* info: blue / lightblue
* success: green
* bot added: green
* error: red
* bot removed: red
* warning: yellow
* cooldown: black
* noiceboard message: noiceboard
*/
const { blue, green, red, black } = require('./colors.json');
const { noice, noice2 } = require('./emojis.json');
const { text } = require('./channels.json');
const { levelRoles } = require('./roles.json');
const { developer, worker, teacher, staff, director } = require('./roles.json');
const { updateMemberSize, updateGuildAmount, sendGuildLog, createEmbed, checkNoiceBoard, sendEmbed, hasRole, sendEmbedWithChannel, editEmbed } = require('./functions');
const { addUser, query, addExp, isBlacklisted, deleteOrders } = require('./dbfunctions');
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();
const cooldowns = new Collection();
client.guildMembers = new Collection();
client.worker = false;
client.teacher = false;
client.staff = false;
client.director = false;
client.toggles = {
    cooldowns: true,
    addExp: true,
    sendEveryone: false,
    roleChecks: true,
    pponlyChecks: true
};
client.applications = {
    worker: true,
    teacher: true,
    developer: true,
    staff: true
};

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

client.on('ready', async () => {
    const guild = client.guilds.cache.get(botGuild);
    client.guildMembers = await guild.members.fetch();
    updateGuildAmount(client);
    updateMemberSize(client);
    client.guildMembers.forEach(member => { if (!member.user.bot) addUser(member.id) });
    query("UPDATE `order` SET status = 'cooked' WHERE status = 'cooking'");
    console.log("Pixel Pizza is ready");
});

client.on('guildCreate', guild => {
    updateGuildAmount(client);
    sendGuildLog(guild.name, guild.iconURL(), createEmbed({
        color: green,
        title: "Added",
        description: `${client.user.username} has been added to the guild ${guild.name}`,
        timestamp: true,
        footer: {
            text: guild.id
        }
    }));
    let channel = guild.systemChannel;
    if (!channel) {
        channel = guild.channels.cache.find(channel => channel.type === "text");
    }
    sendEmbedWithChannel(createEmbed({
        color: green,
        title: "Thank you!",
        description: `Thank you for adding me!\nMy prefix is ${prefix}\nUse ${prefix}help for all commands!`
    }), client, channel);
});

client.on('guildDelete', guild => {
    updateGuildAmount(client);
    sendGuildLog(guild.name, guild.iconURL(), createEmbed({
        color: red,
        title: "Removed",
        description: `${client.user.username} has been removed from the guild ${guild.name}`,
        timestamp: true,
        footer: {
            text: guild.id
        }
    }));
});

client.on('guildMemberAdd', member => {
    if (member.guild.id !== botGuild) return;
    client.guildMembers.set(member.user.id, member);
    if (!member.user.bot) addUser(member.id);
    updateMemberSize(client);
});

client.on('guildMemberRemove', member => {
    if (member.guild.id !== botGuild) return;
    client.guildMembers.delete(member.user.id);
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

client.on('message', async message => {
    deleteOrders(client).then(async () => {
        client.guild = client.guilds.cache.get(botGuild);
        client.member = client.guildMembers.get(message.author.id);
        const guild = client.guild;
        const member = client.member;
        if (message.channel.id === text.logs && !message.webhookID) {
            return message.delete();
        }
        if (message.channel.id === text.updates && message.member) {
            if (!message.member.roles.cache.get(developer)) {
                message.delete();
            }
        }
        if (message.guild == guild && client.toggles.addExp && message.author != client.user) await addExp(client, message.author.id, 1);
        if (message.content.toLowerCase().includes('noice')) {
            message.react(noice).then(console.log).catch(console.error);
        }
        if (!message.content.toLowerCase().startsWith(prefix) || message.webhookID) return;
        console.log(message.content);
        if (message.author.bot && message.content != "pptoggle sendEveryone") return;
        let clientMember;
        client.canSendEmbeds = true;
        if (message.guild) {
            clientMember = message.guild.me;
            if (!clientMember.hasPermission("EMBED_LINKS")) client.canSendEmbeds = false;
        }
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        console.log(commandName);
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        let embedMsg = createEmbed({
            color: red,
            author: {
                name: message.author.username,
                icon: message.author.displayAvatarURL()
            },
            thumbnail: message.author.displayAvatarURL(),
            timestamp: true,
            footer: {
                text: client.user.username,
                icon: client.user.displayAvatarURL()
            }
        });
        if (await isBlacklisted(message.author.id)) return;
        if (message.channel.type == "dm") {
            return sendEmbed(editEmbed(embedMsg, {
                description: "Our commands are unavailable in DMs"
            }), message);
        }
        if (command.removeExp && message.guild == client.guild && client.toggles.addExp && !message.author.bot) await addExp(client, message.author.id, -1);
        if (command.ppOnly && message.guild != guild) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This command can only be used in ${guild.name}`
            }), message);
        }
        if (member) {
            worker.forEach(role => {
                if (member.roles.cache.get(role)) {
                    client.worker = true;
                }
            });
            teacher.forEach(role => {
                if (member.roles.cache.get(role)) {
                    client.teacher = true;
                }
            });
            staff.forEach(role => {
                if (member.roles.cache.get(role)) {
                    client.staff = true;
                }
            });
            director.forEach(role => {
                if (member.roles.cache.get(role)) {
                    client.director = true;
                    client.staff = true;
                }
            });
        }
        if (command.userType == "worker" && !client.worker) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza worker to use this command!"
            }), message);
        }
        if (command.userType == "teacher" && !client.teacher) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza teacher to use this command!"
            }), message);
        }
        if (command.userType == "staff" && !client.staff) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza staff to use this command!"
            }), message);
        }
        if (command.userType == "director" && !client.director) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza director to use this command!"
            }), message);
        }
        if (command.needVip && !hasRole(member, levelRoles.hundered)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to have the vip role in pixel pizza to use this command!"
            }), message);
        }
        let reply;
        if (command.args && !args.length) {
            reply = `There were no arguments given, ${message.author}`;
            if (command.usage) {
                reply += `\nThe proper usage is: '${prefix}${command.name} ${command.usage}'`;
            }
            return sendEmbed(editEmbed(embedMsg, {
                title: '**No arguments**',
                description: reply
            }), message);
        }
        if (command.args == false && args.length) {
            return sendEmbed(editEmbed(embedMsg, {
                title: '**No arguments needed**',
                description: `This command doesn't require any arguments, ${message.author}`
            }), message);
        }
        if (command.minArgs && args.length < command.minArgs) {
            reply = `${prefix}${command.name} takes a minimum of ${command.minArgs} argument(s)`;
            if (command.usage) {
                reply += `\nThe proper usage is ${prefix}${command.name} ${command.usage}`;
            }
            return sendEmbed(editEmbed(embedMsg, {
                description: reply
            }), message);
        }
        if (command.maxArgs && args.length > command.maxArgs) {
            reply = `${prefix}${command.name} takes a maximum of ${command.maxArgs} argument(s)`;
            if (command.usage) {
                reply += `The proper usage is ${prefix}${command.name} ${command.usage}`;
            }
            return sendEmbed(editEmbed(embedMsg, {
                description: reply
            }), message);
        }
        if (command.neededPerms && command.neededPerms.length) {
            for (let index in command.neededPerms) {
                let neededPerm = command.neededPerms[index];
                if (!clientMember.hasPermission(neededPerm)) {
                    return sendEmbed(editEmbed(embedMsg, {
                        title: "Missing permission",
                        description: `I'm missing the \`${neededPerm}\` permission\nIf you want to know why this permission is needed please DM Jaron#3021`
                    }), message);
                }
            }
        }
        if (client.toggles.cooldowns) {
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            let cooldownAmount = (command.cooldown || 0) * 1000;
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return sendEmbed(editEmbed(embedMsg, {
                        color: black,
                        title: '**Cooldown**',
                        description: `please wait ${timeLeft} more second(s) before reusing ${command.name}`
                    }), message);
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        try {
            command.execute(message, args, client);
            console.log(`${command.name} executed!`);
        } catch (error) {
            console.error(error);
            return sendEmbed(editEmbed(embedMsg, {
                title: '**Error**',
                description: 'there was an error trying to execute that command!'
            }), message);
        }
    }).catch(error => {
        console.error(error);
    });
});

client.login(token);