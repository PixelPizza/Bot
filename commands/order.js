const{createEmbed,hasRole,sendEmbed}=require("../functions");
const{query,makeOrderId}=require("../dbfunctions");
const{blue,red}=require('../colors.json');
const{maxPizzas}=require('../config.json');
const{levelRoles}=require('../roles.json');
const{text}=require('../channels.json');

module.exports = {
    name: "order",
    description: "order a pizza",
    args: true,
    minArgs: 1,
    usage: "<order>",
    cooldown: 0,
    userType: "all",
    neededPerms: ["CREATE_INSTANT_INVITE"],
    pponly: false,
    async execute(message,args,client){
        let embedMsg = createEmbed(blue,`**${this.name}**`,null,null,"Your pizza has been ordered and will be cooked as soon as possible");
        let embedMsgOrder = createEmbed(blue,`**${this.name}**`);
        let result=await query("SELECT COUNT(*) as counted FROM `order`");
        if(result[0].counted>=maxPizzas&&!hasRole(client.member,levelRoles.hundered)){
            embedMsgOrder.setColor(red).setDescription(`The maximum pizza amount has been reached! please try again later`);
            return sendEmbed(embedMsgOrder,message);
        }
        const order=args.join(" ");
        if(!order.toLowerCase().includes("pizza")){
            embedMsg.setTitle(`error`).setColor(red).setDescription("The order has to include the word pizza!");
            return sendEmbed(embedMsg,message);
        }
        let result=await query("SELECT * FROM `order` WHERE userId = ?",[message.author.id]);
        if(result.length){
            embedMsg.setColor(red).setDescription(`You have already ordered pizza. please wait until your order has arrived`);
            return sendEmbed(embedMsg,message);
        }
        const id=await makeOrderId();
        await query("INSERT INTO `order`(orderId,userId,guildId,channelId,status,`order`) VALUES(?,?,?,?,'not claimed',?)",[id,message.author.id,message.guild.id,message.channel.id,order]);
        embedMsgOrder.setDescription(`a new order has come in!`).setTimestamp().setFooter(`id: ${id}`);
        const channel=client.channels.cache.get(text.kitchen);
        if(!client.canSendEmbeds)embedMsgOrder=embedMsgOrder.description+`\nId: ${id}`;
        channel.send(embedMsgOrder);
        message.channel.send(embedMsg);
    }
}