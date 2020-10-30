const { Collection } = require('discord.js');
const { createEmbed, sendEmbed, editEmbed, capitalize } = require('../functions');
const { makeApplicationId, query } = require('../dbfunctions');
const { blue, red, green } = require('../colors.json');
const { text } = require('../channels.json');
const questions = require('../questions.json');

module.exports = {
    name: "apply",
    description: "apply in pixel pizza for worker, developer, staff or teacher",
    args: true,
    minArgs: 1,
    maxArgs: 1,
    usage: "<application type>",
    cooldown: 900,
    userType: "all",
    neededPerms: [],
    pponly: true,
    removeExp: false,
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        const answers = [];
        const types = new Collection();
        for (let type in questions) types.set(type, questions[type]);
        const applyType = types.get(args[0]) || types.find(type => type.aliases?.includes(args[0]));
        if (!applyType) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `${args[0]} is not an application type\nAll valid application types are ${types.map(type => type.name).join(", ")}`
            }), message);
        }
        if (!client.applications[applyType.name]) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `This application type is closed at the moment`
            }), message);
        }
        if ((await query(
            "SELECT * \
            FROM application \
            WHERE userId = ? AND applicationType = ? AND status = 'none'",
            [message.author.id, applyType.name]
        )).length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have already applied for this type. Please wait until it has been accepted or rejected`
            }), message);
        }
        const applicationQuestions = [];
        for (let question of applyType.questions) applicationQuestions.push(question);
        const askQuestion = async () => {
            if (applicationQuestions.length) {
                let question = applicationQuestions.shift();
                message.author.send(editEmbed(embedMsg, {
                    description: question,
                    footer: `Type cancel to cancel the application`
                })).then(msg => {
                    const collector = msg.channel.createMessageCollector(m => m.author === message.author, { max: 1 });
                    collector.on('collect', msg => {
                        if (msg.content.toLowerCase() == "cancel") {
                            return msg.edit(editEmbed(embedMsg, {
                                color: green,
                                title: "Canceled",
                                description: "Application canceled"
                            }));
                        }
                        answers.push({
                            question: question,
                            answer: msg.content
                        });
                        askQuestion();
                    });
                });
            } else {
                const appId = await makeApplicationId();
                const embedMsgAnswers = createEmbed({
                    color: blue,
                    title: 'application',
                    author: {
                        name: message.author.tag,
                        icon: message.author.displayAvatarURL()
                    },
                    footer: {
                        text: `id: ${appId}`
                    }
                });
                for (let answer of answers) embedMsgAnswers.addField(answer.question, answer.answer);
                const channel = client.channels.cache.get(text.applications);
                channel.send(embedMsgAnswers);
                message.author.send(editEmbed(embedMsg, {
                    color: green,
                    description: `Application submitted`
                }));
                let answerString = "";
                for (let answer of answers) {
                    answerString += answer.question + "\n" + answer.answer + "\n";
                }
                query(
                    "INSERT INTO application(applicationId, userId, applicationType, answers) \
                    VALUES(?,?,?,?)",
                    [appId, message.author.id, applyType.name, answerString]
                );
            }
        }
        askQuestion();
    }
}