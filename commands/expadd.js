const{createEmbed, sendEmbed}=require("../functions");
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
    userType:"staff",
    neededPerms:[],
    pponly:true,
    execute(message,args,client){
        let embedMsg=createEmbed(red,"**add exp**",null,null,`${args[0]} is not a number`);
        if(isNaN(args[0])||args[0]<1)sendEmbed(embedMsg,message);
        const amount=args.shift();
        let user=message.author;
        if(args.length){
            if(message.mentions.users.first()){
                user=message.mentions.users.first();
            }else if(!isNaN(parseInt(args[0]))){
                user=client.users.cache.get(args[0]);
            }else{
                let username = args.toString().replace(",", " ");
                user=client.users.cache.find(u=>u.username.toLowerCase().includes(username.toLowerCase()));
            }
            if(!user){
                embedMsg.setDescription("User not found");
                return sendEmbed(embedMsg);
            }
        }
        if(!client.guild.members.get(user.id)){
            embedMsg.setDescription(`This user is not in Pixel Pizza`);
            sendEmbed(embedMsg,message);
        }
        addExp(client,user.id,amount);
        embedMsg.setColor(blue).setDescription(`${amount}exp has been added for ${user.tag}`);
        sendEmbed(embedMsg,message);
    }
}