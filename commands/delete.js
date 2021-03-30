const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');
const { createEmbed, getUser, removeRole, sendEmbed, editEmbed } = PixelPizza;
const { red, green } = PixelPizza.colors;
const { work, deliverer, cook } = PixelPizza.roles;
const { creators } = PixelPizza.config;
const { query } = require("../dbfunctions");

module.exports = {
    name: "delete",
    description: "delete a worker",
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
            title: "**Delete worker**"
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
        if(creators.includes(user.id)){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This worker can not be deleted"
            }), client, message);
        }
        const workers = await query("SELECT * FROM `worker` WHERE workerId = ?", [user.id]);
        if(!workers.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user is not a worker"
            }), client, message);
        }
        removeRole(member, work);
        removeRole(member, cook);
        removeRole(member, deliverer);
        query("DELETE FROM worker WHERE workerId = ?", [user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: green.hex,
            description: `${user} has been deleted as worker`,
            fields: [
                {
                    name: "**Note**",
                    value: "You **do not** need to remove any roles from the user"
                }
            ]
        }), client, message);
    }
}