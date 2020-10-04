const{MessageAttachment}=require('discord.js');
const{createEmbed,hasRole,sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');
const{cook}=require('../roles.json');
const{query}=require("../dbfunctions");
const{isUri}=require('valid-url');
const{text}=require('../channels.json');

module.exports={
    name:"change",
    description:"change the image of a cooking or cooked order",
    args:true,
    minArgs:1,
    maxArgs:2,
    usage:"<order id> <image | image link>",
    cooldown:0,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        const embedMsg=createEmbed(blue,"change image");
        const cookRole=client.guild.roles.cache.get(cook);
        if(!hasRole(client.member,cook)){
            embedMsg.setColor(red).setDescription(`You need to have the ${cookRole.name} role in ${client.guild.name} to be able to claim an order`);
            return sendEmbed(embedMsg,message);
        }
        if(message.attachments.array().length>1){
            embedMsg.setColor(red).setDescription(`There are too many attachments! please send only one image with the message!`);
            return sendEmbed(embedMsg,message);
        }
        let results=await query("SELECT * FROM `order` WHERE orderId = ? AND status IN('cooking','cooked')",[args[0]]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`Order ${args[0]} has not been found with the cooking or cooked status`);
            return sendEmbed(embedMsg,message);
        }
        if(results[0].cookId!=message.author.id){
            embedMsg.setColor(red).setDescription(`The image of the order can only be changed by the cook who claimed it`);
            return sendEmbed(embedMsg,message);
        }
        let url;
        if(message.attachments.first()){
            url=message.attachments.first().url;
        }else{
            url=args[1];
        }
        if(!isUri(url)){
            embedMsg.setColor(red).setDescription(`This link is invalid`);
            return sendEmbed(embedMsg,message);
        }
        const imagesChannel=client.channels.cache.get(text.images);
        const attachment=new MessageAttachment(url);
        imagesChannel.send(attachment).then(msg=>{
            query("UPDATE `order` SET imageUrl = ? WHERE orderId = ?",[msg.attachments.first().url,args[0]]);
            embedMsg.setDescription(`The image of the order has been changed`);
            sendEmbed(embedMsg,message);
        });
    }
}