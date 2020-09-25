const {createEmbed}=require('../functions');
const {blue}=require('../colors.json');
const {prefix}=require('../config.json');

module.exports = {
    name: "help",
    description: "list of all executable commands",
    aliases: ['commands'],
    minArgs: 0,
    maxArgs: 1,
    usage: "[command name]",
    cooldown: 5,
    userType: "all",
    execute(message, args, client){
        const embedMsg=createEmbed(blue,null,null,{name:message.author.username,icon:message.author.displayAvatarURL()},null,message.author.displayAvatarURL(),[],null,true,{text:client.user.username,icon:client.user.displayAvatarURL()});
        const embedMsgDM=createEmbed(blue,`**${this.name}**`,null,{name:message.author.username,icon:message.author.displayAvatarURL()},null,message.author.displayAvatarURL(),[],null,true,{text:client.user.username,icon:client.user.displayAvatarURL()});
        let {commands,worker,teacher,staff,director}=message.client;
        let executableCommands = commands.filter(command => command.userType == "all");
        if (worker){
            commands.filter(command=>command.userType=="worker").each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (teacher){
            commands.filter(command=>command.userType=="teacher").each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (staff){
            commands.filter(command=>command.userType=="staff").each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (director){
            commands.filter(command => command.userType == "director").each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (!args.length){
            embedMsgDM.setDescription(`\nYou can send '${prefix}${this.name} ${this.usage}' to get help for specific commands`).addFields({name:'all commands',value:executableCommands.map(command=>command.name).join(', ')},{name:'Commands amount',value:executableCommands.size});
            return message.author.send(embedMsgDM).then(()=>{
                if(message.channel.type==="dm")return;
                embedMsg.setDescription("I've sent you a DM with all commands");
            }).catch(error=>{
                console.error(`Could not send help DM to ${message.author.tag}.\n${error}`);
                embedMsg.setColor(red).setDescription("I can't DM you. Do you have DMs disabled?");
            }).then(()=>{
                message.channel.send(embedMsg);
            });
        }
        const name=args[0].toLowerCase();
        const command=commands.get(name)||commands.find(c=>c.aliases&&c.aliases.includes(name));
        if (!command){
            embedMsg.setColor(red).setDescription(`that's not an existing command!`);
            return message.channel.send(embedMsg);
        }
        const executableCommand=executableCommands.get(name)||executableCommands.find(c=>c.aliases&&c.aliases.includes(name));
        if (!executableCommand){
            embedMsg.setColor(red).setDescription(`You need to be ${command.userType} to execute this command`);
            return message.channel.send(embedMsg);
        }
    }
}