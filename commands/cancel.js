const{createEmbed,sendEmbed}=require("../functions");
const{red,blue}=require('../colors.json');
const{prefix}=require('../config.json');
const{query}=require("../dbfunctions");

module.exports={
    name:"cancel",
    description:"cancel your order",
    args:false,
    cooldown:0,
    userType:"all",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        const embedMsg=createEmbed(red,"**no order**",null,null,`You have not ordered anything use ${prefix}order to order a pizza`);
        const result=await query("SELECT * FORM orders WHERE userId = ?",[message.author.id]);
        if(result.length){
            return sendEmbed(embedMsg,message);
        }
        embedMsg.setColor(blue).setTitle("cancel order").setDescription("Your order has been canceled");
        query("DELETE FROM `order` WHERE userId = ?",[message.author.id]);
        sendEmbed(embedMsg,message);
    }
}