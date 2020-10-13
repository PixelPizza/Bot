const{Collection}=require('discord.js');
const{createEmbed,sendEmbed}=require('../functions');
const{makeApplicationId, query}=require('../dbfunctions');
const{blue,red}=require('../colors.json');
const{text}=require('../channels.json');
const questions=require('../questions.json');

module.exports={
    name:"apply",
    description:"apply in pixel pizza for worker, developer, staff or teacher",
    args:true,
    minArgs:1,
    maxArgs:1,
    usage:"<application type>",
    cooldown:900,
    userType:"all",
    neededPerms:[],
    pponly:true,
    removeExp:false,
    async execute(message,args,client){
        const filter=m=>m.author===message.author;
        const embedMsg=createEmbed(blue,`**${this.name}**`);
        const answers = [];
        const types=new Collection();
        for(let type in questions){
            types.set(type, questions[type]);
        }
        const applyType=types.get(args[0])||types.find(type=>type.aliases&&type.aliases.includes(args[0]));
        if(!applyType){
            embedMsg.setColor(red).setDescription(`${args[0]} is not an application type\nAll valid application types are ${types.map(type=>type.name).join(", ")}`);
            return sendEmbed(embedMsg,message);
        }
        const applicationQuestions = [];
        for(let question of applyType.questions){
            applicationQuestions.push(question);
        }
        async function askQuestion(){
            if(applicationQuestions.length){
                let question = applicationQuestions.shift();
                embedMsg.setDescription(question).setFooter(`Type cancel to cancel the application`);
                message.author.send(embedMsg).then(msg=>{
                    const collector = msg.channel.createMessageCollector(filter, {max: 1});
                    collector.on('collect', msg=>{
                        if(msg.content.toLowerCase() == "cancel")return;
                        answers.push({question: question, answer: msg.content});
                        askQuestion();
                    });
                });
            } else {
                const appId = await makeApplicationId();
                const embedMsgAnswers=createEmbed(blue,'application',null,{name:message.author.tag,icon:message.author.displayAvatarURL()},null,null,[],null,true,{text:`id: ${appId}`});
                for(let answer of answers){
                    embedMsgAnswers.addField(answer.question,answer.answer);
                }
                const channel = client.channels.cache.get(text.applications);
                channel.send(embedMsgAnswers);
                embedMsg.setDescription(`Application submitted`);
                message.author.send(embedMsg);
                let answerString = "";
                for(let answer of answers){
                    answerString+=answer.question+"\n"+answer.answer+"\n";
                }
                query("INSERT INTO application(applicationId, userId, applicationType, answers) VALUES(?,?,?,?)",[appId,message.author.id,applyType.name,answerString]);
            }
        }
        askQuestion();
    }
}