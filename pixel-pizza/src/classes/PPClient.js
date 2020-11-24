'use strict';

//
// Note
// This class has been extended from the discord.js node module
//

const {Client, Collection} = require("discord.js");

/**
 * the Pixel Pizza extended version of the discord.js Client class
 * @extends {Client}
 */
class PPClient extends Client{
    commands = new Collection();
    cooldowns = new Collection();
    guildMembers = new Collection();
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
    canSendEmbeds = false;
    
    /**
     * @param {ClientOptions} options Options for the client
     */
    constructor(options = {}){
        super(options);
    }
}

module.exports = PPClient;