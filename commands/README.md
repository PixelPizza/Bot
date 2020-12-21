Commands Folder
===

Here all main commands of the bot can be found  
All commands have the same format (even the ones in extensions)

Format
---

```js
// Variables from modules like these ones
const discord = require('discord.js');
const PixelPizza = require('pixel-pizza');

// The command itself
module.exports = {
    name: "command_name", // The name of the command
    description: "command_description", // A short description of the command
    aliases: ["command_alias_1", "command_alias_2"], // Other ways to execute the command
    args: true, // If any arguments are needed for this command (remove if arguments can be used, but are not required)
    minArgs: 1, // The minimum amount of arguments
    maxArgs: 10, // The maximum amount of arguments
    usage: "command_usage", // like "<user> [url | attachement]" where | means or
    cooldown: 30, // how many seconds the user has to wait before the command can be reused
    userType: "all", // which type of user can use the command (all, vip, worker, teacher, staff, director)
    neededPerms: [], // The permissions as strings the bot needs to run this command
    pponly: false, // If the command can only be used in the bot guild
    removeExp: false, // If this command gives exp or not
    // JSDoc documentation so the editor knows what the parameters are
    /**
     * Execute this command
     * @param {discord.Message} message
     * @param {string[]} args
     * @param {PixelPizza.PPClient} client
     * @returns {Promise<void>}
     */
    async execute(message, args, client) { // the function to execute
        // some code that will be executed
    }
}
```