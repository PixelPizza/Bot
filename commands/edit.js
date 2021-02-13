const { randomInt } = require('crypto');
const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, editEmbed, capitalize } = PixelPizza; 
const { query } = require("../dbfunctions"); 
const { red, green } = PixelPizza.colors; 
const ingredients = PixelPizza.ingredients;

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
    /**
     * Get a random ingredient from the ingredients list
     * @returns {string}
     */
    getIngredient: () => ingredients[Math.floor(Math.random() * ingredients.length)],
    /**
     * Execute this command
     * @param {discord.Message} message 
     * @param {string[]} args 
     * @param {PixelPizza.PPClient} client 
     * @returns {Promise<void>}
     */
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`
        });
        let order = args.join(" ");
        const result = await query("SELECT * FROM `order` WHERE userId = ? AND status NOT IN('delivered','deleted')", [message.author.id]); 
        if (!result.length) { 
            return sendEmbed(editEmbed(embedMsg, {
                description: `You have not ordered anything, use pporder to order something`
            }), client, message);
        } 
        if(result[0].status != "not claimed"){
            return sendEmbed(editEmbed(embedMsg, {
                description: "Your order has already been claimed"
            }), client, message);
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
            color: green.hex,
            description: "Your order has been edited"
        }), client, message);
    }
}