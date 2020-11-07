const { createEmbed, hasRole, sendEmbed, editEmbed, capitalize, randomInt } = require("../functions"); 
const { query, makeOrderId } = require("../dbfunctions"); 
const { blue, red, green } = require('../colors.json'); 
const { maxPizzas, prefix } = require('../config.json'); 
const { levelRoles, cook } = require('../roles.json'); 
const { text } = require('../channels.json'); 
const ingredients = require('../ingredients.json');

module.exports = { 
    name: "order", 
    description: "order a pizza", 
    args: true, 
    minArgs: 1, 
    usage: "<order>", 
    cooldown: 0, 
    userType: "all", 
    neededPerms: ["CREATE_INSTANT_INVITE"], 
    pponly: false, 
    getIngredient: () => ingredients[Math.floor(Math.random() * ingredients.length)],
    async execute(message, args, client) { 
        let embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`,
            description: "Your pizza has been ordered and will be cooked as soon as possible"
        });
        let result = await query("SELECT COUNT(*) as counted FROM `order`"); 
        if (result[0].counted >= maxPizzas && !hasRole(client.member, levelRoles.hundered)) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `The maximum pizza amount has been reached! please try again later`
            }), message);
        } 
        let order = args.join(" "); 
        if (!order.toLowerCase().includes("pizza") && order != "random") { 
            return sendEmbed(editEmbed(embedMsg, {
                title: `error`,
                description: `The order has to include the word pizza or you can use ${prefix}${this.name} random to order a random pizza`
            }), message);
        } 
        result = await query("SELECT * FROM `order` WHERE userId = ? AND status NOT IN('delivered','deleted')", [message.author.id]); 
        if (result.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have already ordered pizza. please wait until your order has arrived`
            }), message);
        } 
        if (order == "random"){
            const ingredientAmount = randomInt(1, 5);
            const chosenIngredients = [];
            for(let i = 0; i < ingredientAmount; i++){
                let ingredient = this.getIngredient();
                while(chosenIngredients.includes(ingredient)){
                    ingredient = this.getIngredient();
                }
                chosenIngredients.push(ingredient);
            }
            order = `Random pizza with these things: ${chosenIngredients.join(", ")}`;
        }
        const id = await makeOrderId(); 
        await query("INSERT INTO `order`(orderId,userId,guildId,channelId,status,`order`) VALUES(?,?,?,?,'not claimed',?)", [id, message.author.id, message.guild.id, message.channel.id, order]); 
        const embedMsgOrder = createEmbed({
            color: blue,
            title: `**${capitalize(this.name)}**`,
            description: `a new order has come in!`,
            timestamp: true,
            footer: {
                text: `id: ${id}`
            }
        });
        const channel = client.channels.cache.get(text.kitchen); 
        if (!client.canSendEmbeds) embedMsgOrder = embedMsgOrder.description + `\nId: ${id}`; 
        channel.send(`<@&${cook}>`, embedMsgOrder);
        message.channel.send(editEmbed(embedMsg, {color: green})); 
    } 
}