const discord = require("discord.js");
const PixelPizza = require("pixel-pizza");

module.exports = {
  name: "pokefun",
  description: "",
  cooldown: 0,
  userType: "all",
  neededPerms: [],
  pponly: false,
  removeExp: false,
  hidden: true,
  /**
   * Execute this command
   * @param {discord.Message} message
   * @param {string[]} args
   * @param {PixelPizza.PPClient} client
   * @returns {Promise<void>}
   */
  async execute(message, args, client) {
    if(args.length) return;
    try{await message.delete();}catch(error){}
    message.channel.send("https://cdn.discordapp.com/attachments/797945491287572540/798500664829411338/13.png");
  }
}
