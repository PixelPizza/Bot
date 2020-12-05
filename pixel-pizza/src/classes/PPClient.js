'use strict';

//
// Note
// This class has been extended from the discord.js node module
//

const discord = require("discord.js");

/**
 * the Pixel Pizza extended version of the discord.js Client class
 * @extends {discord.Client}
 */
class PPClient extends discord.Client{
    /**
     * The commands of the bot
     */
    commands = new discord.Collection();
    /**
     * The cooldowns on users of the bot
     */
    cooldowns = new discord.Collection();
    /**
     * The members of the main guild of the bot
     */
    guildMembers = new discord.Collection();
    /**
     * Boolean configurations of the bot
     */
    toggles = {
        cooldowns: true,
        addExp: true,
        pponlyChecks: true,
        workerApplications: true,
        teacherApplications: true,
        developerApplications: true,
        staffApplications: true,
        cookOwnOrder: false,
        deliverOwnOrder: false
    };
    /**
     * If the client can send embeds to the channel
     */
    canSendEmbeds = false;
    
    /**
     * @param {discord.ClientOptions} options Options for the client
     */
    constructor(options = {}){
        super(options);
    }
}

module.exports = PPClient;