const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const {createEmbed, hasRole, sendEmbed, editEmbed} = PixelPizza;
const {blue, red} = PixelPizza.colors;
const {deliverer} = PixelPizza.roles;
const {query} = require('../dbfunctions');

module.exports = {
    name: "deliverset",
    description: "set your delivery message",
    aliases: ["delset"],
    args: false,
    cooldown: 30,
    userType: "worker",
    neededPerms: [],
    pponly: false,
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    execute(message, args, client){
        let embedMsg = createEmbed({
            color: blue.hex,
            title: "Set delivery message",
            description: "please tell me your delivery message now"
        });
        const deliverRole = client.guild.roles.cache.get(deliverer);
        if(!hasRole(client.member, deliverer)){
            return sendEmbed(editEmbed(embedMsg, {
                color: red.hex,
                description: `You need to have the ${deliverRole.name} role to be able to set your delivery message!`
            }), client, message);
        }
        sendEmbed(editEmbed(embedMsg, {
            fields: [
                {
                    name: "**Required variables**",
                    value: `Do not forget to use *{${PixelPizza.join(PixelPizza.variables.required, "}*, *{", "}* and *{")}}* so we will replace them with it!`,
                    inline: false
                },
                {
                    name: "**Supported variables**",
                    value: "Supported variables are *{chef}*, *{deliverer}*, *{customer}*, *{image}*, *{invite}*, *{price}*, *{orderdate}*, *{cookdate}*, *{deliverydate}*, *{orderID}* and *{order}*",
                    inline: false
                }
            ]
        }), client, message).then(() => {
            const collector = message.channel.createMessageCollector(m => m.author === message.author, {max:1});
            collector.on('collect', m => {
                const embedMsgError = createEmbed({
                    color: red.hex,
                    title: "Set delivery message",
                    description: "This delivery message does not contain {chef}, {customer}, {image} or {invite}! please try again!"
                });
                const chefAmount = (m.content.match(/{chef}/g) || []).length;
                const imageAmount = (m.content.match(/{image}/g) || []).length;
                const inviteAmount = (m.content.match(/{invite}/g) || []).length;
                const customerAmount = (m.content.match(/{customer}/g) || []).length;
                if(!chefAmount || !imageAmount || !inviteAmount || !customerAmount){
                    return sendEmbed(embedMsg, client, message);
                }
                query(`UPDATE worker SET deliveryMessage = ? WHERE workerId = ?`, [m.content, m.author.id]);
                embedMsg.fields = [];
                sendEmbed(editEmbed(embedMsg, {
                    description: "You have succesfully set your new delivery message!"
                }), client, message);
            });
        });
    }
}