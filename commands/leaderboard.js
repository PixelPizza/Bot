const{createEmbed,sendEmbed}=require("../functions");
const{red,blue}=require('../colors.json');
const{query}=require("../dbfunctions");

module.exports={
    name:"leaderboard",
    description:"see the pixel pizza ranking leaderboard",
    aliases:["lb", "rankings"],
    minArgs:0,
    maxArgs:1,
    usage:"[page]",
    cooldown:0,
    userType:"all",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        const reactions=['⬅️','➡️'];
        let embedMsg=createEmbed(red,`Not a number`,null,null,`${args[0]} is not a number`);
        if(args.length && isNaN(parseInt(args[0]))){
            return sendEmbed(embedMsg,message);
        }
        const pages=[];
        let page=0;
        let name=this.name;
        function addPage(){
            const embedMsg=createEmbed(blue,`**${name}**`,null,null,"```md\n").setFooter(`Page ${page+1}`);
            pages.push(embedMsg);
        }
        addPage();
        let rank=0;
        let itemNumber=0;
        const results=await query("SELECT userId FROM `user` ORDER BY `level` DESC, exp DESC, userId");
        embedMsg.setColor(blue).setTitle(`**${this.name}**`).setDescription(`There are no users in the leaderboard`);
        if(!results.length)return sendEmbed(embedMsg);
        for(let result of results){
            let member=client.guild.members.cache.get(result.userId);
            if(!member)continue;
            rank++;
            itemNumber++;
            let user=member.user;
            let rankString=`#${rank} • ${user.username}\n`;
            if(rank%10==0||itemNumber==results.length)rankString+="```";
            pages[page].description+=rankString;
            if(rank%10==0&&itemNumber!=results.length){
                pages[page].description+="```";
                page++;
                addPage();
            }
        }
        if(!args.length)page=1;
        else page=parseInt(args[0]);
        embedMsg.setColor(red).setTitle("Page not found");
        if(page<1){
            embedMsg.setDescription(`Please use a page number higher than 0`);
            return sendEmbed(embedMsg,message);
        }
        if(pages.length<page){
            embedMsg.setDescription(`page ${page} doesn't exist\nThere are ${pages.length} pages`);
            return sendEmbed(embedMsg,message);
        }
        sendEmbed(pages[page-1],message).then(msg=>{
            msg.react(reactions[0]).then(()=>msg.react(reactions[1]).then(()=>{
                const filter=(reaction,user)=>user.id===message.author.id&&reactions.includes(reaction.emoji.name);
                const collector=msg.createReactionCollector(filter);
                collector.on('collect',r=>{
                    switch(r.emoji.name){
                        case reactions[0]:
                            if(page==1)page=pages.length;
                            else page--;
                            break;
                        case reactions[1]:
                            if(page==pages.length)page=1;
                            else page++;
                            break;
                        default:return;
                    }
                    let newPage=pages[page-1];
                    if(!client.canSendEmbeds)newPage=newPage.description;
                    msg.edit(newPage);
                    msg.reactions.removeAll();
                    msg.react(reactions[0]).then(()=>msg.react(reactions[1]));
                });
            }));
        });
    }
}