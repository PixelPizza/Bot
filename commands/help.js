const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, editEmbed, capitalize, error } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
const { prefix } = PixelPizza.config; 
const { text } = PixelPizza.channels;

module.exports = { 
    name: "help", 
    description: "list of all executable commands", 
    aliases: ['commands'], 
    minArgs: 0, 
    maxArgs: 1, 
    usage: "[command name]", 
    cooldown: 5, 
    userType: "all", 
    neededPerms: [], 
    pponly: false,
    removeExp: false, 
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client, userTypes = {worker: false, teacher: false, staff: false, director: false}) { 
        /** @type {discord.Invite} */
        const invite = await client.guild.channels.cache.get(text.restaurant).createInvite({maxAge: 0, maxUses: 0, unique: false});
        let embedMsg = createEmbed({
            color: blue.hex,
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
        let { worker, teacher, staff, director } = userTypes;
        const commands = message.client.commands.filter(command => !command.hidden);
        /** @type {discord.Collection<string, {name:string,description:string,aliases?:string[],minArgs?:number,maxArgs?:number,usage?:string,cooldown:number,userType:string,neededPerms:string[],pponly:boolean,removeExp:boolean,execute:function}>} */
        let executableCommands = commands.filter(command => command.userType == "all"); 
        if (worker) { 
            commands.filter(command => command.userType == "worker").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (teacher) { 
            commands.filter(command => command.userType == "teacher").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (staff) { 
            commands.filter(command => command.userType == "staff").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (director) { 
            commands.filter(command => command.userType == "director").each(command => { 
                executableCommands.set(command.name, command); 
            }); 
        } 
        if (!args.length) { 
            return message.author.send(editEmbed(embedMsg, {
                title: `**${capitalize(this.name)}**`,
                description: `\nYou can send '${prefix}${this.name} ${this.usage}' to get help for specific commands`,
                fields: [
                    {
                        name: "Director Commands",
                        value: executableCommands.filter(command => command.userType == "director").size ? executableCommands.filter(command => command.userType == "director").map(command => command.name) : null
                    },
                    {
                        name: "Staff Commands",
                        value: executableCommands.filter(command => command.userType == "staff").size ? executableCommands.filter(command => command.userType == "staff").map(command => command.name) : null
                    },
                    {
                        name: "Worker Commands",
                        value: executableCommands.filter(command => command.userType == "worker").size ? executableCommands.filter(command => command.userType == "worker").map(command => command.name) : null
                    },
                    {
                        name: "Vip Commands",
                        value: executableCommands.filter(command => command.userType == "vip").size ? executableCommands.filter(command => command.userType == "vip").map(command => command.name) : null
                    },
                    {
                        name: "Commands for everyone",
                        value: executableCommands.filter(command => command.userType == "all").size ? executableCommands.filter(command => command.userType == "all").map(command => command.name) : null
                    },
                    {
                        name: 'Commands amount',
                        value: executableCommands.size
                    }
                ]
            })).then(() => { 
                if (message.channel.type === "dm") return; 
                embedMsg.setDescription(`I've sent you a DM with all commands\n\nIf you need other help you can join the support server with ${invite.url}`); 
            }).catch(err => {
                error(`Could not send help DM to ${message.author.tag}`, err);
                embedMsg.setColor(red.hex).setDescription("I can't DM you. Do you have DMs disabled?"); 
            }).finally(() => { 
                embedMsg.fields = [];
                sendEmbed(embedMsg, client, message); 
            }); 
        } 
        const name = args[0].toLowerCase(); 
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)); 
        if (!command) { 
            return sendEmbed(editEmbed(embedMsg, {
                color: red.hex,
                description: `that's not an existing command!`
            }), client, message); 
        } 
        const executableCommand = executableCommands.get(name) || executableCommands.find(c => c.aliases && c.aliases.includes(name)); 
        if (!executableCommand) { 
            return sendEmbed(editEmbed(embedMsg, {
                color: red.hex,
                description: `You need to be ${command.userType} to execute this command`
            }), client, message);
        } 
        embedMsg.setColor(blue.hex).addField('**Name**', command.name); 
        if (command.aliases?.length) embedMsg.addField('**Aliases**', command.aliases.join(', ')); 
        if (command.description) embedMsg.addField('**Description**', command.description); 
        if (command.usage) embedMsg.addField('**Usage**', `${prefix}${command.name} ${command.usage}`); 
        embedMsg.addField('**Cooldown**', `${command.cooldown || 0} second(s)`); 
        if (!client.canSendEmbeds) { 
            embedMsg = `Name: ${command.name}`; 
            if (command.aliases) embedMsg += `\nAliases: ${command.aliases.join(', ')}`; 
            if (command.description) embedMsg += `\nDescription: ${command.description}`; 
            if (command.usage) embedMsg += `\nUsage: ${prefix}${command.name} ${command.usage}`; 
            embedMsg += `\nCooldown: ${command.cooldown || 0} second(s)`; 
        } 
        message.channel.send(embedMsg); 
    } 
}