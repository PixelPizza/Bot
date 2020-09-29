const{createEmbed}=require("../functions");
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
            let result=await query("SELECT * FROM `order` WHERE status NOT IN('deleted','delivered')");
            let ordersString=result.length?"\`":"there are no orders at the moment";
            for(let i in results){
                let result=results[i];
                ordersString+=result.orderId;
                if(i==results.length-1){
                    ordersString+="\`";
                }else{
                    ordersString+=", ";
                }
            }
            console.log(ordersString);
        }
    }
}