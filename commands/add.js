const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, getUser, sendEmbed, editEmbed, addRole } = PixelPizza;
const { red, green } = PixelPizza.colors;
const { work } = PixelPizza.roles;
const { query } = require("../dbfunctions");

module.exports = {
    name: "add",
    description: "add a worker",
    args: true,
    minArgs: 1,
    usage: "<user>",
    cooldown: 0,
    userType: "teacher",
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
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red.hex,
            title: "**Add worker**"
        });
        const user = getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "Could not find user"
            }), client, message);
        }
        const member = client.guildMembers.get(user.id);
        if(!member){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user is not in Pixel Pizza"
            }), client, message);
        }
        const workers = await query("SELECT * FROM `worker` WHERE workerId = ?", [user.id]);
        if(workers.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user is already worker"
            }), client, message);
        }
        addRole(member, work);
        query("INSERT INTO worker(workerId, deliveryMessage) VALUES(?, ?)", [user.id, "Hello {customer:tag},\n\nHere is your order\n\nid: {orderID}\norder: {order}\nserver: {server}\nchannel: {channel}\n\nOrdered at: {orderdate:date}\nCooked at: {cookdate:date}\nDelivered at: {deliverydate:date}\n\nIt costs {price}\n\nIt has been cooked by {chef:tag}!\nIt has been delivered by {deliverer:tag}!\nI hope the pizza is what you wanted. If you have any complaints, please join our server and tell it in <#711332618666246254>\n\nIf you want to join our server this is the invite code {invite}!\n\nI hope you have a great day! bye!\n{image}"]);
        sendEmbed(editEmbed(embedMsg, {
            color: green.hex,
            description: `${user} has been added as worker`,
            fields: [
                {
                    name: "**Note**",
                    value: "You will need to add the cook or delivery role to the user"
                }
            ]
        }), client, message);
    }
}