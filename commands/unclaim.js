const{createEmbed,sendEmbed,hasRole}=require('../functions');
const{query}=require('../dbfunctions');
const{cook}=require('../roles.json');
const{red,blue}=require('../colors.json');

module.exports={
    name:"unclaim",
    description:"unclaim a claimed order",
    args:true,
    minArgs:1,
    maxArgs:1,
    usage:"<order id>",
    cooldown:0,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        let embedMsg=createEmbed(blue,`**${this.name}**`,null,null,`You have unclaimed order ${args[0]}`);
        const cookRole=client.guild.roles.cache.get(cook);
        if(!hasRole(client.member,cook)){
            embedMsg.setColor(red).setDescription(`You need to have te ${cookRole.name} role in ${client.guild.name} to be able to unclaim an order`);
            return sendEmbed(embedMsg,message);
        }
        let results=await query("SELECT * FROM `order` WHERE orderId = ?",[args[0]]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`Order ${args[0]} does not exist`);
            return sendEmbed(embedMsg,message);
        }
        if(results[0].status!="claimed"){
            embedMsg.setColor(red).setDescription(`Order ${args[0]} has not been claimed`);
            return sendEmbed(embedMsg,message);
        }
        if(results[0].cookId!=message.author.id){
            embedMsg.setColor(red).setDescription(`Only the cook that claimed the order can unclaim the order`);
            return sendEmbed(embedMsg,message);
        }
        const user=client.users.cache.get(results[0].userId);
        query("UPDATE `order` SET cookId = NULL, status = 'not claimed' WHERE orderId = ?",[args[0]]).then(()=>{
            sendEmbed(embedMsg,message);
            embedMsg.setDescription(`Your order has been unclaimed by the cook who claimed it`);
            user.send(embedMsg).catch(console.error);
        });
    }
}