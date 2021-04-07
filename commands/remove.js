const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, editEmbed } = PixelPizza; 
const { blue, red } = PixelPizza.colors; 
const { query } = require("../dbfunctions"); 
const {rules} = PixelPizza.rules; 

module.exports = { 
    name: "remove", 
    description: "remove an order if it doesn't follow the rules", 
    args: true, 
    minArgs: 1, 
    maxArgs: 1, 
    usage: "<order id>", 
    cooldown: 0, 
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
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: blue.hex,
            title: "remove order"
        });
        const results = await query("SELECT * FROM `order` WHERE orderId = ?", [args[0]]); 
        if (!results.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                color: red.hex,
                description: `Order ${args[0]} doesn't exist`
            }), client, message);
        } 
        sendEmbed(editEmbed(embedMsg, {
            description: `What rule has been broken (please send the rule number)?\n\`\`\`\n${rules.join("\n")}\`\`\``,
            footer: {
                text: "Type cancel to cancel"
            }
        }), client, message).then(msg => { 
            message.channel.createMessageCollector(m => {
                if (m.content.toLowerCase() === "cancel") return true;
                return m.author === message.author && !isNaN(m.content) && parseInt(m.content) <= rules.length; 
            }, { max: 1 }).on('collect', m => { 
                if (m.content.toLowerCase() === "cancel") return msg.edit(createEmbed({
                    color: PixelPizza.colors.green.hex,
                    title: "Remove canceled",
                    description: "The removal has been canceled"
                })); 
                query("UPDATE `order` SET status = 'deleted' WHERE orderId = ?", [args[0]]); 
                embedMsg = editEmbed(embedMsg, {
                    description: `Order ${args[0]} has been removed for violating rule ${m.content}`
                });
                if (!client.canSendEmbeds) embedMsg = embedMsg.description; 
                msg.edit(embedMsg); 
                let user = client.users.cache.get(results[0].userId); 
                user.send(editEmbed(embedMsg, {
                    title: "order removed",
                    description: `Your order has been removed for violation rule:\n${rules[parseInt(m.content) - 1]}\nif you think your order has not violated that rule please join our server and make a complaint in #complaints`,
                    fields: [
                        {name: "Invite link", value: "https://discord.com/invite/AW7z9qu"}
                    ]
                })); 
            }); 
        }); 
    } 
}