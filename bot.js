//#region variables
//#region requires
const fs = require('fs');
const PixelPizza = require("pixel-pizza");
const { Collection, Permissions, VoiceChannel } = require('discord.js');
const {Api} = require("@top-gg/sdk");
const token = fs.existsSync("./secrets.json") ? require('./secrets.json').token : process.env.BOT_TOKEN;
const { addUser, query, addExp, isBlacklisted } = require('./dbfunctions');
//#endregion
//#region global variables
const client = new PixelPizza.PPClient({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { prefix, botGuild, verification, workerRoles, pponlyexceptions, creators } = PixelPizza.config;
const prefixRegex = new RegExp(`^${prefix} ?`, "i");
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
const { blue, green, red, black } = PixelPizza.colors;
const { noice, noice2 } = PixelPizza.emojis;
const { text, voice } = PixelPizza.channels;
const { verified, pings, cook, deliverer, developer, worker, teacher, staff, director, makers } = PixelPizza.roles;
const { msToString, updateMemberSize, updateGuildAmount, sendGuildLog, createEmbed, checkNoiceBoard, sendEmbed, editEmbed, isVip, addRole, removeRole, hasRole, error, success, log, notice } = PixelPizza;
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//#endregion
//#region custom client variables
client.dbl = new Api(fs.existsSync("./secrets.json") ? require('./secrets.json').dbltoken : process.env.DBL_TOKEN);
client.commands = new Collection();
client.cooldowns = new Collection();
client.guildMembers = new Collection();
client.canSendEmbeds = true;
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
client.guild;
//#endregion
//#endregion

//#region client commands
for (let file of cmdFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}
//#endregion

//#region process events
//#region process unhandledRejection
process.on('unhandledRejection', err => {
    const message = (err.stack.length > 2000 ? err.message : err.stack).replace(/\/home\/pi\/PixelPizza/g, "");
    error('Unhandled promise rejection', message);
    console.error(err);
});
//#endregion
//#region process exit
process.on('exit', () => {
    notice('Exited', `${client.user.username} exited`);
});
//#endregion
//#endregion

//#region client events
//#region client error
client.on('error', err => {
    const message = (err.stack.length > 2000 ? err.message : err.stack).replace(/\/home\/pi\/PixelPizza/g, "");
    error('Websocket connection error', message);
    console.error(err);
});
//#endregion
//#region client ready
client.on('ready', async () => {
    // post bot stats to top.gg
    setInterval(() => {
        client.dbl.postStats({
            serverCount: client.guilds.cache.size
        });
    }, 1800000);
    client.guild = client.guilds.cache.get(botGuild);
    /** @type {VoiceChannel} */
    const totalGuilds = client.guild.channels.cache.get(voice.guilds);
    totalGuilds.setName(`Total guilds: ${client.guilds.cache.size}`);
    const delivery = client.guild.channels.cache.get(text.delivery);
    client.guildMembers = await client.guild.members.fetch();
    updateGuildAmount(client);
    updateMemberSize(client);
    client.users.cache.forEach(user => { if (!user.bot) addUser(user.id) });
    const result = await query("UPDATE `order` SET status = 'cooked', cookedAt = CURRENT_TIMESTAMP WHERE status = 'cooking'");
    for(let toggle of await query("SELECT * FROM toggle")){
        client.toggles[toggle.key] = toggle.value ? true : false;
    }
    setInterval(async () => {
        const embedMsg = createEmbed({
            color: blue.hex,
            title: "**Orders**"
        });
        const orders = await query("SELECT orderId, status FROM `order` WHERE status NOT IN('cooking','deleted','delivered')"); 
        const kitchenOrders = orders.filter(order => order.status == "not claimed" || order.status == "claimed");
        const deliveryOrders = orders.filter(order => order.status == "cooked");
        if(kitchenOrders.length){
            const kitchen = client.guild.channels.cache.get(text.kitchen);
            let ordersString = "`"; 
            for (let i in kitchenOrders) { 
                let result = kitchenOrders[i]; 
                ordersString += result.orderId; 
                if (i == kitchenOrders.length - 1) { 
                    ordersString += "`"; 
                } else { 
                    ordersString += ", "; 
                } 
            } 
            sendEmbed(editEmbed(embedMsg, {
                description: ordersString
            }), client, kitchen); 
        }
        if(deliveryOrders.length){
            let ordersString = "`"; 
            for (let i in deliveryOrders) { 
                let result = deliveryOrders[i]; 
                ordersString += result.orderId; 
                if (i == deliveryOrders.length - 1) { 
                    ordersString += "`"; 
                } else { 
                    ordersString += ", "; 
                } 
            } 
            sendEmbed(editEmbed(embedMsg, {
                description: ordersString
            }), client, delivery);
        }
    }, 4 * 60 * 60 * 1000);
    if(result.affectedRows > 0){
        sendEmbed(createEmbed({
            color: green.hex,
            title: "Orders cooked",
            description: "All cooking orders are now cooked!"
        }), client, delivery);
    }
    success('Ready', `${client.user.username} is ready`);
});
//#endregion
//#region client guildCreate
client.on('guildCreate', guild => {
    /** @type {VoiceChannel} */
    const totalGuilds = client.guild.channels.cache.get(voice.guilds);
    totalGuilds.setName(`Total guilds: ${client.guilds.cache.size}`);
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
    sendEmbed(createEmbed({
        color: green.hex,
        title: "Thank you!",
        description: `Thank you for adding me!\nMy prefix is ${prefix}\nUse ${prefix}help for all commands!`
    }), client, channel);
});
//#endregion
//#region client guildDelete
client.on('guildDelete', guild => {
    /** @type {VoiceChannel} */
    const totalGuilds = client.guild.channels.cache.get(voice.guilds);
    totalGuilds.setName(`Total guilds: ${client.guilds.cache.size}`);
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
//#endregion
//#region client guildMemberAdd
client.on('guildMemberAdd', member => {
    if (member.guild.id !== botGuild) return;
    console.log(client.guildMembers)
    client.guildMembers.set(member.user.id, member);
    console.log(client.guildMembers);
    member.guild.channels.cache.get(text.restaurant).send(createEmbed({
        color: PixelPizza.colors.blue.hex,
        title: "**Welcome**",
        description: `Welcome to ${member.guild.name} ${member}!\nIf you want to order a pizza you can use ${prefix}order\nYou can also apply for worker, staff, teacher or developer. You can find an explanation of how to apply in ${member.guild.channels.cache.get(text.apply)}`
    }));
    if (!member.user.bot) addUser(member.id);
    updateMemberSize(client);
});
//#endregion
//#region client guildMemberRemove
client.on('guildMemberRemove', member => {
    if (member.guild.id !== botGuild) return;
    console.log(client.guildMembers)
    client.guildMembers.delete(member.user.id);
    console.log(client.guildMembers)
    updateMemberSize(client);
});
//#endregion
//#region client guildMemberUpdate
client.on('guildMemberUpdate', (oldMember, newMember) => {
    if(oldMember.guild.id !== botGuild) return;
    client.guildMembers.set(oldMember.user.id, newMember);
});
//#endregion
//#region client messageReactionAdd
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
//#endregion
//#region client messageReactionRemove
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
//#endregion
//#region client message
client.on('message', async message => {
    if(/^<@!?[0-9]{18}>$/.test(message.content.trim()) && message.mentions.has(client.user)) {
        const invite = await client.guild.channels.cache.get(text.restaurant).createInvite({maxAge: 0, maxUses: 0, unique: false});
        return sendEmbed(createEmbed({
            color: blue.hex,
            title: "Do you need my help?",
            description: [
                `My prefix is ${prefix}`,
                `You can use ${prefix}help to view all commands`,
                "",
                `If you need other help you can join our support server with ${invite.url}`
            ]
        }), client, message);
    }
    if(message.channel.type == "dm") {
        return;
    }
    const member = client.guildMembers.get(message.author.id);
    if ((message.channel.id === text.logs && !message.webhookID) || (message.channel.id === text.updates && message.member && !message.member.roles.cache.get(developer))) return message.delete();
    if (message.guild == client.guild && client.toggles.addExp && message.author != client.user) await addExp(client, message.author.id, 1);
    if (message.content.toLowerCase().includes('noice') && (message.guild && message.guild == client.guild)) {
        message.react(noice).catch(err => error('Could not add noice reaction', err));
    }
    if(message.content.toLowerCase().startsWith(`${prefix}.`) && creators.includes(message.author.id)){try{message.delete();}catch{}finally{return message.channel.send(message.content.slice(`${prefix} `.length));}}
    const prefixText = prefixRegex.exec(message.content);
    if (!prefixText || message.webhookID) return;
    client.canSendEmbeds = message.guild && message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.EMBED_LINKS) ? true : false;
    const args = message.content.slice(prefixText[0].length).split(/ +/);
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
    if (command.removeExp && message.guild == client.guild && client.toggles.addExp && !message.author.bot) await addExp(client, message.author.id, -1);
    if (client.toggles.pponlyChecks && command.ppOnly && message.guild != client.guild && !pponlyexceptions.includes(message.guild.id)) {
        return sendEmbed(editEmbed(embedMsg, {
            description: `This command can only be used in ${guild.name}`
        }), client, message);
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
            }), client, message);
        }
        if (command.userType == "teacher" && !isTeacher) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza teacher to use this command!"
            }), client, message);
        }
        if (command.userType == "staff" && !isStaff) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza staff to use this command!"
            }), client, message);
        }
        if (command.userType == "director" && !isDirector) {
            return sendEmbed(editEmbed(embedMsg, {
                description: "You need to be Pixel Pizza director to use this command!"
            }), client, message);
        }
    }
    if (command.userType == "vip" && !isVip(member)) {
        return sendEmbed(editEmbed(embedMsg, {
            description: "You need to have the vip role in pixel pizza to use this command!"
        }), client, message);
    }
    if (command.userType == "maker" && !makers.includes(message.author.id)){
        return sendEmbed(editEmbed(embedMsg, {
            description: `Only the makers of this bot can run this command!`
        }), client, message);
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
        }), client, message);
    }
    if (command.args == false && args.length) {
        return sendEmbed(editEmbed(embedMsg, {
            title: '**No arguments needed**',
            description: `This command doesn't require any arguments, ${message.author}`
        }), client, message);
    }
    if (command.minArgs && args.length < command.minArgs) {
        reply = `${prefix}${command.name} takes a minimum of ${command.minArgs} argument(s)`;
        if (command.usage) {
            reply += `\nThe proper usage is ${prefix}${command.name} ${command.usage}`;
        }
        return sendEmbed(editEmbed(embedMsg, {
            description: reply
        }), client, message);
    }
    if (command.maxArgs && args.length > command.maxArgs) {
        reply = `${prefix}${command.name} takes a maximum of ${command.maxArgs} argument(s)`;
        if (command.usage) {
            reply += `The proper usage is ${prefix}${command.name} ${command.usage}`;
        }
        return sendEmbed(editEmbed(embedMsg, {
            description: reply
        }), client, message);
    }
    if (command.neededPerms && command.neededPerms.length) {
        for (let index in command.neededPerms) {
            let neededPerm = command.neededPerms[index];
            if (!message.channel.permissionsFor(message.guild.me).has(neededPerm)) {
                return sendEmbed(editEmbed(embedMsg, {
                    title: "Missing permission",
                    description: `I'm missing the \`${neededPerm}\` permission\nIf you want to know why this permission is needed please DM Jaron#3021`
                }), client, message);
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
                return sendEmbed(editEmbed(embedMsg, {
                    color: black.hex,
                    title: '**Cooldown**',
                    description: `please wait ${msToString(expirationTime - now)} before reusing ${command.name}`
                }), client, message);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    try {
        await command.execute(message, args, client, {worker: isWorker, teacher: isTeacher, staff: isStaff, director: isDirector, botguildMember: member});
        log("Command executed", `${command.name} has been executed`);
    } catch (err) {
        error(`Could not execute ${command.name}`, err);
        return sendEmbed(editEmbed(embedMsg, {
            title: '**Error**',
            description: 'there was an error trying to execute that command!'
        }), client, message);
    }
});
//#endregion
//#endregion

client.login(token);
