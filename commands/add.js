const { createEmbed, getUser, sendEmbed, editEmbed, addRole } = require("../functions");
const { red, green } = require('../colors.json');
const { work } = require('../roles.json');
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
    async execute(message, args, client) {
        const embedMsg = createEmbed({
            color: red,
            title: "**Add worker**"
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
        if(workers.length){
            return sendEmbed(editEmbed(embedMsg, {
                description: "This user is already worker"
            }), message);
        }
        addRole(member, work);
        query("INSERT INTO worker(workerId) VALUES(?)", [user.id]);
        sendEmbed(editEmbed(embedMsg, {
            color: green,
            description: `${user} has been added as worker`,
            fields: [
                {
                    name: "**Note**",
                    value: "You will need to add the cook or delivery role to the user"
                }
            ]
        }), message);
    }
}