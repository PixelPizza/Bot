const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const {createEmbed, hasRole, sendEmbed, editEmbed, join, variables, makeUserRegex } = PixelPizza;
const {blue, red, green} = PixelPizza.colors;
const {deliverer} = PixelPizza.roles;
const {query} = require('../dbfunctions');

module.exports = {
    name: "deliverset",
    description: "set your delivery message",
    aliases: ["delset"],
    args: false,
    cooldown: 0,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    /**
     * Set your delivery message
     * @param {PixelPizza.PPClient} client The client of the bot
     * @param {discord.Message} message The message to get the channel from
     * @param {discord.Message} msg The message the bot sent
     * @returns {Promise<any>}
     */
    async setMessage(client, message, msg){
        const embedMsg = msg.embeds[0];
        const collector = message.channel.createMessageCollector(m => m.author === message.author, {max:1});
        collector.on('collect', async m => {
            if(m.content == "cancel") return msg.edit(createEmbed({
                color: green.hex,
                title: "**Canceled**",
                description: "You have canceled setting your delivery message"
            }));
            const embedMsgError = createEmbed({
                color: red.hex,
                title: "Set delivery message",
                description: "This delivery message does not contain ",
                footer: {
                    text: "Type cancel to stop setting your delivery message"
                }
            });
            const chefAmount = (m.content.match(makeUserRegex("chef")) || []).length;
            const imageAmount = (m.content.match(/{image}/g) || []).length;
            const inviteAmount = (m.content.match(/{invite}/g) || []).length;
            const customerAmount = (m.content.match(makeUserRegex("customer")) || []).length;
            if(!chefAmount || !imageAmount || !inviteAmount || !customerAmount){
                if(!chefAmount) embedMsgError.description += "{chef}, ";
                if(!imageAmount) embedMsgError.description += "{image}, ";
                if(!inviteAmount) embedMsgError.description += "{invite}, ";
                if(!customerAmount) embedMsgError.description += "{customer}, ";
                embedMsgError.description = embedMsgError.description.substring(0, embedMsgError.description.lastIndexOf(", "));
                embedMsgError.description += "! please try again!";
                const msg = await sendEmbed(embedMsgError, client, message);
                return this.setMessage(client, m, msg);
            }
            query(`UPDATE worker SET deliveryMessage = ? WHERE workerId = ?`, [m.content, m.author.id]);
            embedMsg.fields = [];
            embedMsg.footer.text = "";
            sendEmbed(editEmbed(embedMsg, {
                color: green.hex,
                description: "You have succesfully set your new delivery message!"
            }), client, message);
        });
    },
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @param {{
     *  worker: boolean,
     *  teacher: boolean,
     *  staff: boolean,
     *  director: boolean,
     *  botguildMember: discord.GuildMember
     * }} options
     * @returns {Promise<void>}
     */
    async execute(message, args, client, options){
        let embedMsg = createEmbed({
            color: blue.hex,
            title: "Set delivery message",
            description: "please tell me your delivery message now"
        });
        const deliverRole = client.guild.roles.cache.get(deliverer);
        if(!hasRole(options.botguildMember, deliverer)){
            return sendEmbed(editEmbed(embedMsg, {
                color: red.hex,
                description: `You need to have the ${deliverRole.name} role to be able to set your delivery message!`
            }), client, message);
        }
        sendEmbed(editEmbed(embedMsg, {
            fields: [
                {
                    name: "**Required variables**",
                    value: `Do not forget to use *{${join(variables.required, "}*, *{", "}* and *{")}}* so we will replace them with it!`,
                    inline: false
                },
                {
                    name: "**Supported variables**",
                    value: `Supported variables are *{${join(variables.required.concat(...variables.others), "}*, *{", "}* and *{")}}*`,
                    inline: false
                }
            ],
            footer: {
                text: "Type cancel to stop setting your delivery message"
            }
        }), client, message).then(msg => {
            this.setMessage(client, message, msg);
        });
    }
}