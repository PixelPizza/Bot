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
    }
}