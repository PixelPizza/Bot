const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { Collection } = discord;
const { createEmbed, sendEmbed, editEmbed, capitalize } = PixelPizza;
const { makeId, query } = require('../dbfunctions');
const { blue, red, green } = PixelPizza.colors;
const { text } = PixelPizza.channels;
const questions = PixelPizza.questions;

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
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client, options) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        if(!PixelPizza.inBotGuild(client, message.author.id)){
            return sendEmbed(editEmbed(embedMsg, {
                description: `You need to be in ${client.guild.name} to apply\nYou can use ${PixelPizza.config.prefix}support for an invite link`
            }), client, message);
        }
        const answers = [];
        const types = new Collection();
        for (let type in questions) types.set(type, questions[type]);
        const applyType = types.get(args[0]) || types.find(type => type.aliases?.includes(args[0]));
        if (!applyType) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `${args[0]} is not an application type\nAll valid application types are ${types.map(type => type.name).join(", ")}`
            }), client, message);
        }
        if (!client.toggles[`${applyType.name}Applications`]){
            return sendEmbed(editEmbed(embedMsg, {
                description: `This application type is closed at the moment`
            }), client, message);
        }
        if ((await query(
            "SELECT * \
            FROM application \
            WHERE userId = ? AND applicationType = ? AND status = 'none'",
            [message.author.id, applyType.name]
        )).length) {
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have already applied for this type. Please wait until it has been accepted or rejected`
            }), client, message);
        }
        const applicationQuestions = [];
        for (let question of applyType.questions) applicationQuestions.push(question);
        const askQuestion = async () => {
            if (applicationQuestions.length) {
                let question = applicationQuestions.shift();
                message.author.send(editEmbed(embedMsg, {
                    color: blue.hex,
                    description: question,
                    footer: {
                       text: `Type cancel to cancel the application` 
                    }
                })).then(msg => {
                    const collector = msg.channel.createMessageCollector(m => m.author === message.author, { max: 1 });
                    collector.on('collect', ms => {
                        if (ms.content.toLowerCase() == "cancel") {
                            return msg.edit(editEmbed(embedMsg, {
                                color: green.hex,
                                title: "Canceled",
                                description: "Application canceled"
                            }));
                        } else if(ms.content.length > 1024){
                            message.author.send(createEmbed({
                                color: red.hex,
                                title: "Answer too long",
                                description: "The answer can not be longer than 1024 characters"
                            }));
                            applicationQuestions.unshift(question);
                        } else {
                            answers.push({
                                question: question,
                                answer: ms.content
                            });
                        }
                        askQuestion();
                    });
                });
            } else {
                const appId = await makeId("application");
                const embedMsgAnswers = createEmbed({
                    color: blue.hex,
                    title: 'Application',
                    author: {
                        name: message.author.tag,
                        icon: message.author.displayAvatarURL()
                    },
                    footer: {
                        text: `id: ${appId} | status: none | staff: none`
                    }
                });
                for (let answer of answers) embedMsgAnswers.addField(answer.question, answer.answer);
                const channel = client.channels.cache.get(text.applications);
                channel.send(embedMsgAnswers);
                message.author.send(editEmbed(embedMsg, {
                    color: green.hex,
                    description: `Application submitted`
                }));
                query(
                    "INSERT INTO application(applicationId, userId, applicationType, answers) \
                    VALUES(?,?,?,?)",
                    [appId, message.author.id, applyType.name, JSON.stringify(answers)]
                );
            }
        }
        askQuestion();
    }
}