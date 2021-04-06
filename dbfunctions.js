//#region variables
const { randomInt } = require('crypto');
const discord = require('discord.js');
const PixelPizza = require("pixel-pizza");
const fs = require('fs');
const mysql = require("mysql2");
const {addRole, removeRole, hasRole, error} = PixelPizza;
const {baseexp, addexp} = PixelPizza.level;
const {botGuild, idLength, proAmount} = PixelPizza.config;
const {levelRoles, proCook, proDeliverer} = PixelPizza.roles;
const secrets = fs.existsSync("./secrets.json") ? require('./secrets.json') : null;
const database = secrets ? secrets.database : {
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASS, 
    database: process.env.DATABASE_DB
};
//#endregion

//#region handleDisconnect
/** @type {mysql.Connection} */
let con;
/**
 * Handle the disconnection of a database
 * @returns {void}
 */
const handleDisconnect = () => {
    con = mysql.createConnection(database);
    con.connect(err => {
        if(err){
            error('DB connection error', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    con.on('error', err => {
        error('DB error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.message === "Can't add new command when connection is in closed state")handleDisconnect();
        else throw err;
    });
}
handleDisconnect();
//#endregion

//#region query
/**
 * Query to the database
 * @param {string} query 
 * @param {any[]} options 
 * @returns {Promise<any>}
 */
exports.query = (query, options = []) => new Promise((resolve, reject)=>con.execute(query, options, (error, result) => {
    if(error) {
        con.emit("error", error);
        reject(error);
    }
    else resolve(result);
}));
//#endregion
//#region addUser
/**
 * Add a user to users
 * @param {discord.Snowflake} userId 
 * @returns {void}
 */
exports.addUser = userId => {
    if(isNaN(userId) || userId.length != 18) return;
    this.query("SELECT * FROM `user` WHERE userId = ?", [userId]).then(result => {
        if(!result.length) this.query("INSERT INTO `user`(userId) VALUES(?)", [userId]);
    });
}
//#endregion
//#region checkRole
/**
 * Check and add roles
 * @param {number} number 
 * @param {number} goal 
 * @param {discord.GuildMember} member 
 * @param {discord.RoleResolvable} role 
 * @returns {void}
 */
const checkRole = (number, goal, member, role) => {
    if(number >= goal && !hasRole(member, role)){
        addRole(member, role);
    } else if (number < goal && hasRole(member, role)){
        removeRole(member, role);
    }
}
//#endregion
//#region checkLevelRoles
/**
 * Check if a user should have certain roles
 * @param {PixelPizza.PPClient} client 	
 * @param {discord.Snowflake} userId 
 * @returns {Promise<void>}
 */
exports.checkLevelRoles = async (client, userId) => {
    if(isNaN(userId) || userId.length != 18) return;
    const exception = (await this.query("SELECT * FROM vipException WHERE userId = ?", [userId])).length ? true : false;
    this.query("SELECT `level` FROM user WHERE userId = ?", [userId]).then(result => {
        if(result.length){
            const level = result[0].level;
            const member = client.guilds.cache.get(botGuild).members.cache.get(userId);
            checkRole(level, 5, member, levelRoles.five);
            checkRole(level, 10, member, levelRoles.ten);
            checkRole(level, 25, member, levelRoles.twentyfive);
            checkRole(level, 50, member, levelRoles.fifty);
            if(!exception) checkRole(level, 100, member, levelRoles.hundered);
        }
    });
}
//#endregion
//#region checkLevel
/**
 * Check the level of a user
 * @param {PixelPizza.PPClient} client 
 * @param {discord.Snowflake} userId 
 * @returns {Promise<void>}
 */
exports.checkLevel = async (client, userId) => {
    if(isNaN(userId) || userId.length != 18) return;
    const result = await this.query("SELECT exp, `level` FROM user WHERE userId = ?", [userId]);
    if(!result.length) return;
    const exp = result[0].exp;
    let level = result[0].level;
    while(true){
        if(exp < (baseexp * level + addexp * (level - 1))){
            level--;
        } else if(exp >= (baseexp * (level + 1) + addexp * level)){
            level++;
        } else {
            break;
        }
    }
    this.query("UPDATE user SET `level` = ? WHERE userId = ?", [level, userId]).then(async ()=>{
        await this.checkLevelRoles(client, userId);
    });
}
//#endregion
//#region setExp
/**
 * Set the exp of a user
 * @param {PixelPizza.PPClient} client 
 * @param {discord.Snowflake} userId 
 * @param {number} amount 
 * @returns {Promise<void>}
 */
exports.setExp = (client, userId, amount) => new Promise(async resolve => {
    amount = parseInt(amount);
    if(isNaN(userId) || userId.length != 18 || isNaN(amount) || amount < 0) return;
    this.query("UPDATE `user` SET `exp` = ? WHERE userId = ?", [amount, userId]).then(()=>{
        this.checkLevel(client, userId);
        resolve();
    });
});
//#endregion
//#region addExp
/**
 * Add exp to a user
 * @returns {Promise<void>}
 */
exports.addExp = (client, userId, amount) => new Promise(async resolve => {
    amount=parseInt(amount);
    if(isNaN(userId) || userId.length != 18 || isNaN(amount)) return;
    const results = await this.query("SELECT `exp` FROM `user` WHERE userId = ?", [userId]);
    if(!results.length) return;
    const wantedExp = results[0].exp + amount;
    if(wantedExp < 0) return;
    await this.setExp(client, userId, wantedExp);
    resolve();
});
//#endregion
//#region setLevel
/**
 * Set the level of a user
 * @param {PixelPizza.PPClient} client 
 * @param {discord.Snowflake} userId 
 * @param {number} amount 
 * @returns {Promise<void>}
 */
exports.setLevel = (client, userId, amount) => new Promise(async resolve => {
    amount = parseInt(amount);
    if(isNaN(userId) || userId.length != 18 || isNaN(amount) || amount < 0) return;
    if(amount == 0) return this.setExp(client, userId, amount);
    const neededExp = baseexp * (amount) + addexp * (amount - 1);
    await this.setExp(client, userId, neededExp);
    resolve();
});
//#endregion
//#region addLevel
/**
 * Add levels to a user
 * @param {PixelPizza.PPClient} client 
 * @param {discord.Snowflake} userId 
 * @param {number} amount 
 * @returns {Promise<void>}
 */
exports.addLevel = (client, userId, amount) => new Promise(async resolve => {
    amount = parseInt(amount);
    if(isNaN(userId) || userId.length != 18 || isNaN(amount)) return;
    const results = await this.query("SELECT `level` FROM `user` WHERE userId = ?", [userId]);
    if(!results.length) return;
    const wantedLevel = results[0].level + amount;
    if(wantedLevel < 0) return;
    await this.setLevel(client, userId, wantedLevel);
    resolve();
});
//#endregion
//#region isBlacklisted
/**
 * Check if a user is blacklisted
 * @param {discord.Snowflake} userId 
 * @returns {Promise<boolean>}
 */
exports.isBlacklisted = async (userId) => {
    if(isNaN(userId) || userId.length != 18) return false;
    const result = await this.query("SELECT * FROM blacklisted WHERE userId = ?", [userId]);
    return result.length ? true : false;
}
//#endregion
//#region checkProChef
/**
 * Check if a member is pro chef
 * @param {discord.GuildMember} member 
 * @returns {Promise<void>}
 */
exports.checkProChef = async member => {
    const workers = await this.query("SELECT * FROM worker WHERE workerId = ?", [member.user.id]);
    if(!workers.length) return;
    if(workers[0].cooks >= proAmount && !hasRole(member, proCook)){
        addRole(member, proCook);
    } else if(workers[0].cooks < proAmount && hasRole(member, proCook)){
        removeRole(member, proCook);
    }
}
//#endregion
//#region checkProDeliverer
/**
 * Check if a member is pro deliverer
 * @param {discord.GuildMember} member 
 * @returns {Promise<void>}
 */
exports.checkProDeliverer = async member => {
    const workers = await this.query("SELECT * FROM worker WHERE workerId = ?", [member.user.id]);
    if(!workers.length) return;
    if(workers[0].deliveries >= proAmount && !hasRole(member, proDeliverer)){
        addRole(member, proDeliverer);
    } else if(workers[0].deliveries < proAmount && hasRole(member, proDeliverer)){
        removeRole(member, proDeliverer);
    }
}
//#endregion
//#region makeId
/**
 * Make a new id
 * @param {string} table 
 * @returns {Promise<string>}
 */
exports.makeId = async (table) => {
    const characters = /* "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz */"0123456789"/* -_" */;
    let id = "";
    for(let i = 0; i < idLength; i++){
        id += characters.charAt(randomInt(0, characters.length));
    }
    const result = await this.query(`SELECT \`${table}Id\` FROM \`${table}\` WHERE \`${table}Id\` = ?`,[id]);
    return result.length ? this.makeId(table) : id;
}
//#endregion