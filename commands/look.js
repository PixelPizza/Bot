const{query}=require('../dbfunctions');
const{createEmbed,sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');

module.exports={
    name:"look",
    description:"look at an order by order id",
    aliases:["show"],
    args:true,
    minArgs:1,
    maxArgs:1,
    usage:"<order id>",
    cooldown:0,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        let embedMsg=createEmbed(blue,`**${this.name}**`);
        const results=await query("SELECT * FROM `order` WHERE orderId = ?",[args[0]]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`The order with order id ${args[0]} does not exist`);
            return sendEmbed(embedMsg,message);
        }
        const result=results[0];
        const orderer=client.users.cache.get(result.userId).username;
        const guild=client.guilds.cache.get(result.guildId);
        const channel=guild.channels.cache.get(result.channelId);
        channel.name=channel?channel.name:"Deleted Channel";
        let cook="none";
        if(result.cookId)cook=client.guild.members.cache.get(result.cookId)?client.users.cache.get(result.cookId).username:"Deleted Cook";
        let deliverer="none";
        if(result.delivererId)deliverer=client.guild.members.cache.get(result.delivererId)?client.users.cache.get(result.delivererId).username:"Deleted Deliverer";
        embedMsg.setDescription(`*${result.order}*`).addFields(
            {name:"Orderer",value:orderer},
            {name:"Guild name",value:guild.name,inline:true},
            {name:"Ordered in channel",value:channel.name,inline:true}
        ).setFooter(`id: ${result.orderId} | status: ${result.status} | cook: ${cook} | deliverer: ${deliverer}`);
        if(!client.canSendEmbeds)embedMsg=`${embedMsg.description}\n${embedMsg.fields[0].name}\n${embedMsg.fields[0].value}\n${embedMsg.fields[1].name}\n${embedMsg.fields[1].value}\n${embedMsg.fields[2].name}\n${embedMsg.fields[2].value}\n${embedMsg.footer.text}`;
        message.channel.send(embedMsg);
    }
}