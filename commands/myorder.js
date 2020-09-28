const{createEmbed, sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');
const { query } = require("../dbfunctions");

module.exports = {
    name: "myorder",
    description: "see your current order",
    args: false,
    cooldown: 0,
    userType: "all",
    neededPerms: [],
    pponly: false,
    async execute(message,args,client){
        let embedMsg = createEmbed(red,"**order**",null,null,`You have not ordered anything use ${prefix}order to order a pizza`);
        let result=await query("SELECT * FROM `order` WHERE userId = ?",[message.author.id]);
        if(!result.length){
            return sendEmbed(embedMsg);
        }
        const guild=client.guilds.get(result[0].guildId);
        const channel=result[0].channelId;
        let cook="none";
        if(result[0].cookId){
            cook=client.guild.members.cache.get(result[0].cookId)?client.users.cache.get(result[0].cookId).username:"Deleted Cook";
        }
        let deliverer="none";
        if(result[0].delivererId){
            deliverer=client.guild.members.cache.get(result[0].delivererId)?client.users.cache.get(result[0].delivererId).username:"Deleted Deliverer";
        }
        embedMsg.setColor(blue).setDescription(`***${result[0].order}***`).addFields({name:"Orderer",value:message.author.tag},{name:"Guild",value:guild.name,inline:true},{name:"Ordered in channel",value:`<#${channel}>`,inline:true}).setFooter(`id: ${result[0].orderId} | status: ${result[0].status} | cook: ${cook} | deliverer: ${deliverer}`);
        if(!client.canSendEmbeds)embedMsg=`${embedMsg.description}\n${embedMsg.fields[0].name}\n\`${embedMsg.fields[0].value}\`\n${embedMsg.fields[1].name}\n\`${embedMsg.fields[1].value}\`\n${embedMsg.fields[2].name}\n${embedMsg.fields[2].value}\n${embedMsg.footer}`;
        message.channel.send(embedMsg);
    }
}