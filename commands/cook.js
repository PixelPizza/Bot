const{MessageAttachment}=require('discord.js');
const{createEmbed,hasRole,sendEmbed, sendEmbedWithChannel}=require("../functions");
const{blue,red}=require('../colors.json');
const{cook}=require('../roles.json');
const{query}=require("../dbfunctions");
const{isUri}=require('valid-url');
const{text}=require('../channels.json');

module.exports={
    name:"cook",
    description:"cook an order",
    args:true,
    minArgs:1,
    maxArgs:2,
    usage:"<order id> <image | image link>",
    cooldown:0,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        let embedMsg=createEmbed(blue,`**${this.name}**`);
        const cookRole=client.guild.roles.cache.get(cook);
        if(!hasRole(client.member,cook)){
            embedMsg.setColor(red).setDescription(`You need to have the ${cookRole.name} role in ${client.guild.name} to be able to cook an order`);
            return sendEmbed(embedMsg,message);
        }
        if(message.attachments.array().length > 1){
            embedMsg.setColor(red).setDescription(`There are too many attachments! please send only one image with the message!`);
            return sendEmbed(embedMsg,message);
        }
        let results=await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'claimed'",[args[0]]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`Order ${args[0]} has not been found with the claimed status`);
            return sendEmbed(embedMsg,message);
        }
        if(results[0].cookId!=message.author.id){
            embedMsg.setColor(red).setDescription(`This order has already been claimed by someone else`);
            return sendEmbed(embedMsg,message);
        }
        let url;
        if(message.attachments.first()){
            url=message.attachments.first().url;
        } else {
            url=args[1];
        }
        if(!isUri(url)){
            embedMsg.setColor(red).setDescription(`This link is invalid`);
            return sendEmbed(embedMsg,message);
        }
        const imagesChannel=client.channels.cache.get(text.images);
        const attachment=new MessageAttachment(url);
        imagesChannel.send(attachment).then(msg=>{
            query("UPDATE `order` SET imageUrl = ?, status = 'cooking' WHERE orderId = ?",[msg.attachments.first().url,args[0]]);
            const cookTime = Math.floor((Math.random() * 420) + 60);
            const cookMinutes = Math.floor(cookTime / 60);
            const cookSeconds = cookTime % 60;
            embedMsg.setDescription(`The order is cooking for ${cookMinutes}m${cookSeconds}s`);
            const confirmation=createEmbed(blue,'confirmation',null,null,'Your order is now being cooked');
            const user=client.users.cache.get(results[0].userId);
            user.send(confirmation);
            setTimeout(()=>{
                query("UPDATE `order` SET status = 'cooked' WHERE orderId = ?",[args[0]]);
                query("UPDATE worker SET cooks = cooks + 1 WHERE workerId = ?",[message.author.id]);
                embedMsg.setDescription(`Order ${args[0]} is done cooking`);
                const deliverChannel=client.channels.cache.get(text.delivery);
                sendEmbedWithChannel(embedMsg,client,deliverChannel);
                confirmation.setDescription(`Your order has been cooked`);
                user.send(confirmation);
            },cookTime*1000);
            sendEmbed(embedMsg,message);
        });
    }
}