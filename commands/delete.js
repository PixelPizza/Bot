const { createEmbed, getUser, removeRole, sendEmbed, editEmbed } = require("../functions");
const { red, green } = require('../colors.json');
const { work, deliverer, cook } = require('../roles.json');
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
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: "**Delete worker**"
        });
        const user = getUser(message, args, client);
        if(!user){
            return sendEmbed(editEmbed(embedMsg, {
                description: "Could not find user"
            }), message);
        }
        const member = client.guildMembers.get(user.id);
        if(!member){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user is not in Pixel Pizza"
            }), message);
        }
        const workers = await query("SELECT * FROM `worker` WHERE workerId = ?", [user.id]);
        if(!workers.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user is not a worker"
            }), message);
        }
        removeRole(member, work);
        removeRole(member, cook);
        removeRole(member, deliverer);
        query("DELETE FROM worker WHERE workerId = ?", [user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `${user} has been deleted as worker`,
            fields: [
                {
                    name: "**Note**",
                    value: "You **do not** need to remove any roles from the user"
                }
            ]
        }), message);
    }
}