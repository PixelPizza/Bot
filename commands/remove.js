const{createEmbed,sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');
const{query}=require("../dbfunctions");
const rules=require('../rules.json');

module.exports={
    name:"remove",
    description:"remove an order if it doesn't follow the rules",
    args:true,
    minArgs:1,
    maxArgs:1,
    usage:"<order id>",
    cooldown:0,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        let embedMsg=createEmbed(blue,"remove order");
        const embedMsgDM=createEmbed(blue,"order removed");
        const results=await query("SELECT * FROM `order` WHERE orderId = ?",[args[0]]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`Order ${args[0]} doesn't exist`);
            return sendEmbed(embedMsg,message);
        }
        embedMsg.setDescription(`What rule has been broken (please send the rule number)?\n\`\`\`\n${rules.join("\n")}\`\`\``);
        sendEmbed(embedMsg,message).then(msg=>{
            let filter=m=>{
                if(m.content==="cancel")return true;
                return m.author === message.author && !isNaN(m.content) && parseInt(m.content) <= rules.length;
            };
            const collector=message.channel.createMessageCollector(filter, {max:1});
            collector.on('collect',m=>{
                if (m.content === "cancel"){
                    return;
                }
                query("UPDATE `order` SET status = 'deleted' WHERE orderId = ?",[args[0]]);
                embedMsg.setDescription(`Order ${args[0]} has been removed for violating rule ${m.content}`);
                if(!client.canSendEmbed)embedMsg=embedMsg.description;
                msg.edit(embedMsg);
                embedMsgDM.setDescription(`Your order has been removed for violation rule:\n${rules[parseInt(m.content) - 1]}\nif you think your order has not violated that rule please join our server and make a complaint in #complaints`).addField("Invite link", "https://discord.com/invite/AW7z9qu");
                let user = client.users.cache.get(results[0].userId);
                user.send(embedMsgDM);
            });
        });
    }
}