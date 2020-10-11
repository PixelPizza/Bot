const{createEmbed,sendEmbed,getUser,inBotGuild}=require("../functions");
const{blue,red}=require('../colors.json');
const{addExp}=require("../dbfunctions");

module.exports={
    name:"expadd",
    description:"add exp to a user",
    aliases:["addexp"],
    args:true,
    minArgs:1,
    usage:"<amount> [user]",
    cooldown:10,
    userType:"director",
    neededPerms:[],
    pponly:true,
    removeExp:true,
    async execute(message,args,client){
        let embedMsg=createEmbed(red,"**add exp**",null,null,`${args[0]} is not a number`);
        if(isNaN(args[0]))return sendEmbed(embedMsg,message);
        if(parseInt(args[0])<1){
            embedMsg.setDescription(`The number can not be any lower than 1`);
            return sendEmbed(embedMsg,message);
        }
        const amount=args.shift();
        let user=message.author;
        if(args.length){
            user=getUser(message,args,client);
            if(!user){
                embedMsg.setDescription("User not found");
                return sendEmbed(embedMsg,message);
            }
        }
        if(!inBotGuild(client,user.id)){
            embedMsg.setDescription(`This user is not in Pixel Pizza`);
            return sendEmbed(embedMsg,message);
        }
        await addExp(client,user.id,amount);
        embedMsg.setColor(blue).setDescription(`${amount} exp has been added for ${user.tag}`);
        sendEmbed(embedMsg,message);
    }
}