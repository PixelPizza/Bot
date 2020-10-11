const{createEmbed,sendEmbed,getUser,inBotGuild}=require("../functions");
const{blue,red}=require('../colors.json');
const{addLevel}=require("../dbfunctions");

module.exports={
    name:"levelremove",
    description:"remove levels from a user",
    aliases:["removelevel"],
    args:true,
    minArgs:1,
    usage:"<amount> [user]",
    cooldown:0,
    userType:"director",
    neededPerms:[],
    pponly:true,
    removeExp:true,
    async execute(message,args,client){
        let embedMsg=createEmbed(red,"**remove level**",null,null,`${args[0]} is not a number`);
        if(isNaN(args[0]))return sendEmbed(embedMsg,message);
        if(parseInt(args[0])<1){
            embedMsg.setDescription(`The number can not be any lower than 1`);
            return sendEmbed(embedMsg,message);
        }
        const amount=parseInt(args.shift());
        let user=message.author;
        if(args.length){
            user=getUser(message,args,client);
            if(!user){
                embedMsg.setDescription("User not found");
                return sendEmbed(embedMsg);
            }
        }
        if(!inBotGuild(client,user.id)){
            embedMsg.setDescription(`This user is not in Pixel Pizza`);
            return sendEmbed(embedMsg,message);
        }
        await addLevel(client,user.id,-amount);
        embedMsg.setColor(blue).setDescription(`${amount} levels have been removed for ${user.tag}`);
        sendEmbed(embedMsg,message);
    }
}