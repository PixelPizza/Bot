const fs = require('fs');
const PixelPizza = require("pixel-pizza");
const { Collection } = require('discord.js');
const client = new PixelPizza.PPClient({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { prefix, botGuild, verification, workerRoles, pponlyexceptions } = PixelPizza.config;
const token = fs.existsSync("./secrets.json") ? require('./secrets.json').token : process.env.BOT_TOKEN;
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
* timer: silver
*/
const { green, red, black } = PixelPizza.colors;
const { noice, noice2 } = PixelPizza.emojis;
const { text } = PixelPizza.channels;
const { verified, pings, cook, deliverer, developer, worker, teacher, staff, director } = PixelPizza.roles;
const { updateMemberSize, updateGuildAmount, sendGuildLog, createEmbed, checkNoiceBoard, sendEmbed, sendEmbedWithChannel, editEmbed, isVip, addRole, removeRole, hasRole, error, success, log, notice } = PixelPizza;
const { addUser, query, addExp, isBlacklisted, deleteOrders } = require('./dbfunctions');
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();
client.cooldowns = new Collection();
client.guildMembers = new Collection();
client.toggles = {
    cooldowns: true,
    addExp: true,
    pponlyChecks: true,
    workerApplications: true,
    teacherApplications: true,
    developerApplications: true,
    staffApplications: true,
    cookOwnOrder: false,
    deliverOwnOrder: false
};

for (let file of cmdFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

process.on('unhandledRejection', err => {
    const message = (err.stack.length > 2000 ? err.message : err.stack).replace(/\/home\/pi\/PixelPizza/g, "");
    error('Unhandled promise rejection', message);
    console.error(err);
});

process.on('exit', () => {
    notice('Exited', `${client.user.username} exited`);
});

client.on('error', err => {
    const message = (err.stack.length > 2000 ? err.message : err.stack).replace(/\/home\/pi\/PixelPizza/g, "");
    error('Websocket connection error', message);
    console.error(err);
});

client.on('ready', async () => {
    const guild = client.guilds.cache.get(botGuild);
    client.guildMembers = await guild.members.fetch();
    updateGuildAmount(client);
    updateMemberSize(client);
    client.guildMembers.forEach(member => { if (!member.user.bot) addUser(member.id) });
    query("UPDATE `order` SET status = 'cooked' WHERE status = 'cooking'");
    for(let toggle of await query("SELECT * FROM toggle")){
        client.toggles[toggle.key] = toggle.value ? true : false;
    }
    success('Ready', `${client.user.username} is ready`);
    // console.log((await client.shard.broadcastEval(`this.guilds.cache.get("${botGuild}")`)).find(value => value != null));
});

client.on('guildCreate', guild => {
    updateGuildAmount(client);
    sendGuildLog(guild.name, guild.iconURL(), createEmbed({
        color: green.hex,
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
        color: green.hex,
        title: "Thank you!",
        description: `Thank you for adding me!\nMy prefix is ${prefix}\nUse ${prefix}help for all commands!`
    }), client, channel);
});

client.on('guildDelete', guild => {
    updateGuildAmount(client);
    sendGuildLog(guild.name, guild.iconURL(), createEmbed({
        color: red.hex,
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

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if(oldMember.guild.id !== botGuild) return;
    client.guildMembers.set(oldMember.user.id, newMember);
});

client.on('messageReactionAdd', async (messageReaction, user) => {
    if(messageReaction.partial){
        try{
            messageReaction = await messageReaction.fetch();
        } catch (err) {
            return error('Could not fetch reaction', err);
        }
    }
    if (user.partial){
        try{
            user = await user.fetch();
        } catch (err){
            return error('Could not fetch user', err);
        }
    }
    const member = client.guildMembers.get(user.id);
    if (messageReaction.message.guild.id !== botGuild) return;
    if (messageReaction.message.id === verification && messageReaction.emoji.name == "✅") addRole(member, verified);
    if (messageReaction.message.id === workerRoles){
        if(messageReaction.emoji.name == "🍳" && hasRole(member, cook)) addRole(member, pings.cook);
        if(messageReaction.emoji.name == "📫" && hasRole(member, deliverer)) addRole(member, pings.deliver);
    }
    if (messageReaction.emoji.id === noice2) checkNoiceBoard(messageReaction);
});

client.on('messageReactionRemove', async (messageReaction, user) => {
    if(messageReaction.partial){
        try{
            messageReaction = await messageReaction.fetch();
        } catch (err) {
            return error('Could not fetch reaction', err);
        }
    }
    if (user.partial){
        try{
            user = await user.fetch();
        } catch (err){
            return error('Could not fetch user', err);
        }
    }
    const member = client.guildMembers.get(user.id);
    if (messageReaction.message.guild.id !== botGuild) return;
    if (messageReaction.message.id === verification && messageReaction.emoji.name == "✅") removeRole(member, verified);
    if (messageReaction.message.id === workerRoles){
        if(messageReaction.emoji.name == "🍳" && hasRole(member, cook)) removeRole(member, pings.cook);
        if(messageReaction.emoji.name == "📫" && hasRole(member, deliverer)) removeRole(member, pings.deliver);
    }
    if (messageReaction.emoji.id === noice2) checkNoiceBoard(messageReaction);
});

client.on('message', async message => {
    deleteOrders(client).then(async () => {
        client.guild = client.guilds.cache.get(botGuild);
        client.member = client.guildMembers.get(message.author.id);
        const guild = client.guild;
        const member = client.member;
        if ((message.channel.id === text.logs && !message.webhookID) || (message.channel.id === text.updates && message.member && !message.member.roles.cache.get(developer))) return message.delete();
        if (message.guild == guild && client.toggles.addExp && message.author != client.user) await addExp(client, message.author.id, 1);
        if (message.content.toLowerCase().includes('noice')) {
            message.react(noice).catch(err => error('Could not add noice reaction', err));
        }
        if (!message.content.toLowerCase().startsWith(prefix) || message.webhookID) return;
        if (message.author.bot && message.content != "pptoggle sendEveryone") return;
        let clientMember;
        client.canSendEmbeds = true;
        if (message.guild) {
            clientMember = message.guild.me;
            if (!clientMember.hasPermission("EMBED_LINKS")) client.canSendEmbeds = false;
        }
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        log(`Command used by ${message.author.tag} in ${message.guild.name} #${message.channel.name}`, commandName);
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        let embedMsg = createEmbed({
            color: red.hex,
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
        if (client.toggles.pponlyChecks && command.ppOnly && message.guild != guild && !pponlyexceptions.includes(message.guild.id)) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This command can only be used in ${guild.name}`
            }), message);
        }
        let isWorker = false;
        let isTeacher = false;
        let isStaff = false;
        let isDirector = false;
        if (member) {
            worker.forEach(role => {
                if (hasRole(member, role)) {
                    isWorker = true;
                }
            });
            teacher.forEach(role => {
                if (hasRole(member, role)) {
                    isTeacher = true;
                }
            });
            staff.forEach(role => {
                if (hasRole(member, role)) {
                    isStaff = true;
                }
            });
            director.forEach(role => {
                if (hasRole(member, role)) {
                    isDirector = true;
                }
            });
        }
        if(!isDirector){
            if (command.userType == "worker" && !isWorker) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: "You need to be Pixel Pizza worker to use this command!"
                }), message);
            }
            if (command.userType == "teacher" && !isTeacher) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: "You need to be Pixel Pizza teacher to use this command!"
                }), message);
            }
            if (command.userType == "staff" && !isStaff) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: "You need to be Pixel Pizza staff to use this command!"
                }), message);
            }
            if (command.userType == "director" && !isDirector) {
                return sendEmbed(editEmbed(embedMsg, {
                    description: "You need to be Pixel Pizza director to use this command!"
                }), message);
            }
        }
        if (command.userType == "vip" && !isVip(member)) {
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
            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Collection());
            }
            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            let cooldownAmount = (command.cooldown || 0) * 1000;
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return sendEmbed(editEmbed(embedMsg, {
                        color: black.hex,
                        title: '**Cooldown**',
                        description: `please wait ${timeLeft} more second(s) before reusing ${command.name}`
                    }), message);
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        try {
            command.execute(message, args, client, {worker: isWorker, teacher: isTeacher, staff: isStaff, director: isDirector});
            log("Command executed", `${command.name} has been executed`);
        } catch (err) {
            error(`Could not execute ${command.name}`, err);
            return sendEmbed(editEmbed(embedMsg, {
                title: '**Error**',
                description: 'there was an error trying to execute that command!'
            }), message);
        }
    }).catch(err => {
        error('Could not delete orders', err);
    });
});

client.login(token);