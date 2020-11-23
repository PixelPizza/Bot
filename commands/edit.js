const { createEmbed, sendEmbed, editEmbed, capitalize, randomInt, isVip } = require("../functions"); 
const { query, makeOrderId } = require("../dbfunctions"); 
const { blue, red, green } = require('../colors.json'); 
const { maxPizzas, prefix } = require('../config.json'); 
const { pings } = require('../roles.json'); 
const { text } = require('../channels.json'); 
const ingredients = require('../ingredients.json');

module.exports = {
    name: "edit",
    description: "edit your order if it has not been claimed yet",
    aliases: [],
    args: true,
    minArgs: 1,
    maxArgs: 0,
    usage: "<new order>",
    cooldown: 300,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    getIngredient: () => ingredients[Math.floor(Math.random() * ingredients.length)],
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: `**${capitalize(this.name)}**`
        });
        let order = args.join(" ");
        if (!order.toLowerCase().includes("pizza") && order != "random") { 
            return sendEmbed(editEmbed(embedMsg, {
                title: `error`,
                description: `The order has to include the word pizza or you can use ${prefix}${this.name} random to order a random pizza`
            }), message);
        }  
        const result = await query("SELECT * FROM `order` WHERE userId = ? AND status NOT IN('delivered','deleted')", [message.author.id]); 
        if (!result.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have not ordered anything, use pporder to order a pizza`
            }), message);
        } 
        if(result[0].status != "not claimed"){
            return sendEmbed(editEmbed(embedMsg, {
                description: "Your order has already been claimed"
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
        await query("UPDATE `order` SET `order` = ? WHERE orderId = ?", [order, result[0].orderId]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: "Your order has been edited"
        }), message);
    }
}