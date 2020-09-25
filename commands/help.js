const {createEmbed}=require('../functions');
const {blue}=require('../colors.json');

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
        const embedMsg = createEmbed(blue, null, null, {name: message.author.username, icon: message.author.displayAvatarURL()}, null, message.author.displayAvatarURL(), [], null, true, {text: client.user.username, icon: client.user.displayAvatarURL()});
        const embedMsgDM = createEmbed(blue, `**${this.name}**`, null, {name: message.author.username, icon: message.author.displayAvatarURL()}, null, message.author.displayAvatarURL(), [], null, true, {text: client.user.username, icon: client.user.displayAvatarURL()});
        
        const {commands, worker, teacher, staff, director} = message.client;
        let workerCommands = commands.filter(command => command.userType == "worker");
        let teacherCommands = commands.filter(command => command.userType == "teacher");
        let staffCommands = commands.filter(command => command.userType == "staff");
        let directorCommands = commands.filter(command => command.userType == "director");
        let executableCommands = commands.filter(command => command.userType == "all");
        if (worker){
            workerCommands.each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (teacher){
            teacherCommands.each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (staff){
            staffCommands.each(command => {
                executableCommands.set(command.name, command);
            });
        }
        if (director){
            directorCommands.each(command => {
                executableCommands.set(command.name, command);
            });
        }
    }
}