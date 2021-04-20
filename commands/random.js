const { randomInt } = require('crypto');
const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const {sendEmbed, createEmbed} = PixelPizza;
const {blue} = PixelPizza.colors;
const ingredients = PixelPizza.ingredients;

module.exports = {
    name: "random",
    description: "Show random ingredients",
    aliases: ["randomingredients"],
    args: false,
    cooldown: 10,
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
        let ingredients = [];
        for(let i = 0; i < randomInt(1, 5); i++){
            ingredients.push(this.getIngredient());
        }
        sendEmbed(createEmbed({
            color: blue.hex,
            title: "Ingredients",
            description: ingredients
        }), client, message);
    }
}