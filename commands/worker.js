const{createEmbed,sendEmbed, getUser, inBotGuild}=require("../functions");
const{blue,red}=require('../colors.json');
const{query}=require('../dbfunctions');

module.exports={
    name:"worker",
    description:"get info on a pixel pizza worker with the user id",
    usage:"[user id]",
    cooldown:0,
    userType:"staff",
    neededPerms:[],
    ppOnly:true,
    removeExp:false,
    async execute(message,args,client){
        let embedMsg = createEmbed(blue,`**${this.name}**`,null,{name:message.author.username,icon:message.author.displayAvatarURL()},null,null,[],null,true,{text:client.user.username,icon:client.user.displayAvatarURL()});
        let user=message.author;
        if(args.length){
            user=getUser(message,args,client);
            if(!user){
                embedMsg.setColor(red).setDescription(`user not found`);
                sendEmbed(embedMsg,message);
            }
        }
        if(!inBotGuild(client,user.id)){
            embedMsg.setColor(red).setDescription(`This user is not in pixel pizza`);
            sendEmbed(embedMsg,message);
        }
        const result=await query("SELECT * FROM worker WHERE workerId = ?",[user.id]);
        if(!result.length){
            embedMsg.setColor(red).setDescription(`This user is not a pixel pizza worker`);
            sendEmbed(embedMsg,message);
        }
        const worker=result[0];
        const guild=client.guild;
        const member=guild.members.cache.get(user.id);
        if(!worker.deliveryMessage)worker.deliveryMessage = "none";
        embedMsg.addFields({name:"Nickname",value:member.displayName},{name:"Cooks",value:worker.cooks,inline:true},{name:"Deliveries",value:worker.deliveries,inline:true},{name:"Delivery Message",value:worker.deliveryMessage},{name:"Added At",value:worker.addedAt});
        if(!client.canSendEmbeds)embedMsg=`Nickname\n\`${member.displayName}\`\nCooks\n\`${worker.cooks}\`\nDeliveries\n\`${worker.deliveries}\`\nDelivery Message\n\`\`\`\n${worker.deliveryMessage}\n\`\`\`\nAdded At\n\`${worker.addedAt}\``;
        message.channel.send(embedMsg);
    }
}