const PixelPizza = require("pixel-pizza");
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
            }), message);
        }
        sendEmbed(editEmbed(embedMsg, {
            fields: [
                {
                    name: "**Note**",
                    value: "Do not forget to use *{chef}*, *{customer}*, *{image}* and *{invite}* so we will replace them with it!",
                    inline: false
                },
                {
                    name: "**Note**",
                    value: "Supported variables are *{chef}*, *{deliverer}*, *{customer}*, *{image}*, *{invite}*, *{orderdate}*, *{cookdate}*, *{deliverydate}*, *{orderID}* and *{order}*",
                    inline: false
                }
            ]
        }), message).then(() => {
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
                    return sendEmbed(embedMsg, message);
                }
                query(`UPDATE worker SET deliveryMessage = ? WHERE workerId = ?`, [m.content, m.author.id]);
                embedMsg.fields = [];
                sendEmbed(editEmbed(embedMsg, {
                    description: "You have succesfully set your new delivery message!"
                }), message);
            });
        });
    }
}