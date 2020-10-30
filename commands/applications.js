const { query } = require("../dbfunctions");

module.exports = {
    name: "applications",
    description: "show all application types and if they are opened",
    aliases: ["apps"],
    args: false,
    cooldown: 30,
    userType: "all",
    neededPerms: [],
    pponly: false,
    removeExp: false,
    async execute(message, args, client) {
        const applications = {};
        for(let application of await query(
            "SELECT * \
            FROM toggles \
            WHERE `key` LIKE '%Applications'"
        )) applications[application.key.replace("Aplications", "")] = application.value ? true : false;
        console.log(applications);
    }
}