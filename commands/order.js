const { randomInt } = require('crypto');
const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, sendEmbed, editEmbed, capitalize, isVip } = PixelPizza; 
const { query, makeId } = require("../dbfunctions"); 
const { blue, red, green } = PixelPizza.colors; 
const { maxPizzas, prefix } = PixelPizza.config; 
const { pings } = PixelPizza.roles; 
const { text } = PixelPizza.channels; 
const ingredients = PixelPizza.ingredients;

module.exports = { 
    name: "order", 
    description: "order a pizza", 
    args: true, 
    minArgs: 1, 
    usage: "<order> [{chef: chef, deliverer: deliverer} | {chef: chef} | {deliverer: deliverer}]", 
    cooldown: 0, 
    userType: "all", 
    neededPerms: ["CREATE_INSTANT_INVITE"], 
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
        let embedMsg = createEmbed({
            color: red.hex,
            title: `**${capitalize(this.name)}**`,
            description: "Your pizza has been ordered and will be cooked as soon as possible"
        });
        let chef = null;
        let deliverer = null;
        const selection = /^.*?({chef:(?<chef>.+?), *deliverer:(?<deliverer>.+?)}|{chef:(?<chefsingle>.+?)}|{deliverer:(?<deliverersingle>.+?)})$/.exec(message);
        if(selection){
            args = args.reverse();
            args.splice(0, selection[1].split(/ +/).length);
            const select = {
                chef: (selection.groups.chef || selection.groups.chefsingle)?.trim(),
                deliverer: (selection.groups.deliverer || selection.groups.deliverersingle)?.trim()
            };
            args = args.reverse();
            chef = client.guildMembers.find(member => member.user.id == select.chef || member.user.username.toLowerCase().includes(select.chef?.toLowerCase()) || member.displayName.toLowerCase().includes(select.chef?.toLowerCase()));
            deliverer = client.guildMembers.find(member => member.user.id == select.deliverer || member.user.username.toLowerCase().includes(select.deliverer?.toLowerCase()) || member.displayName.toLowerCase().includes(select.deliverer?.toLowerCase()));
            const chefResult = await query("SELECT * FROM worker WHERE workerId = ?", [chef?.id || null]);
            const deliverResult = await query("SELECT * FROM worker WHERE workerId = ?", [deliverer?.id || null]);
            if(select.chef && !chefResult.length){
                return sendEmbed(editEmbed(embedMsg, {
                    title: "Chef not found",
                    description: "Could not find chef"
                }), message);
            }
            if(select.deliverer && !deliverResult.length){
                return sendEmbed(editEmbed(embedMsg, {
                    title: "Deliverer not found",
                    description: "Could not find deliverer"
                }), message);
            }
        }
        let result = await query("SELECT COUNT(*) as counted FROM `order` WHERE status NOT IN('delivered', 'deleted')"); 
        if (result[0].counted >= maxPizzas && !isVip(client.member)) { 
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
        const id = await makeId("order"); 
        const selections = "(orderId,userId,guildId,channelId,status,`order`" + (chef ? ",cookId" : "") + (deliverer ? ",delivererId" : "") + ")";
        const values = "(?,?,?,?,'not claimed',?" + (chef ? ",?" : "") + (deliverer ? ",?" : "") + ")";
        const options = [id, message.author.id, message.guild.id, message.channel.id, order];
        if(deliverer){
            options.push(deliverer.id);
        }
        if(chef){
            options.push(chef.id);
        }
        await query("INSERT INTO `order`" + selections + " VALUES" + values, options); 
        const embedMsgOrder = createEmbed({
            color: blue.hex,
            title: `**${capitalize(this.name)}**`,
            description: `a new order has come in!`,
            timestamp: true,
            footer: {
                text: `id: ${id}${chef ? ` | chef: ${chef.user.username}` : ""}${deliverer ? ` | deliverer: ${deliverer.user.username}` : ""}`
            }
        });
        const channel = client.channels.cache.get(text.kitchen); 
        if (!client.canSendEmbeds) embedMsgOrder = embedMsgOrder.description + `\nId: ${id}`; 
        channel.send(`<@&${pings.cook}>`, embedMsgOrder);
        sendEmbed(editEmbed(embedMsg, {
            color: green.hex,
            fields: [
                {
                    name: "Your order",
                    value: order
                }
            ]
        }), message); 
    } 
}