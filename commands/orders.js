const{createEmbed,sendEmbed}=require("../functions");
const{query}=require("../dbfunctions");
const{blue,red}=require('../colors.json');
const{statuses}=require('../config.json');

module.exports={
    name:"orders",
    description:"show all orders",
    minArgs:0,
    maxArgs:1,
    usage:"<status>",
    cooldown:0,
    userType:"worker",
    pponly:false,
    async execute(message,args,client){
        let embedMsg=createEmbed(blue,`**${this.name}**`);
        if(!args.length){
            let results=await query("SELECT * FROM `order` WHERE status NOT IN('deleted','delivered')");
            let ordersString=results.length?"\`":"there are no orders at the moment";
            for(let i in results){
                let result=results[i];
                ordersString+=result.orderId;
                if(i==results.length-1){
                    ordersString+="\`";
                }else{
                    ordersString+=", ";
                }
            }
            embedMsg.setDescription(ordersString);
            return sendEmbed(embedMsg,message);
        }
    }
}