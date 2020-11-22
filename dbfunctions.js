const fs = require('fs');
const mysql = require("mysql2");
const {addRole, removeRole, hasRole, randomInt, isVip} = require('./functions');
const {baseexp, addexp} = require('./level.json');
const {botGuild, idLength} = require('./config.json');
const {levelRoles} = require('./roles.json');
const secrets = fs.existsSync("./secrets.json") ? require('./secrets.json') : null;
const database = secrets ? secrets.database : {
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASS, 
    database: process.env.DATABASE_DB
};
const { error } = require("./consolefunctions");
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

let con;
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
        if(err.code === 'PROTOCOL_CONNECTION_LOST')handleDisconnect();
        else throw err;
    });
}
handleDisconnect();

exports.query = (query, options = []) => new Promise((resolve, reject)=>con.execute(query, options, (error, result) => {
    if(error) reject(error);
    else resolve(result);
}));
exports.addUser = userId => {
    if(isNaN(userId) || userId.length != 18) return;
    this.query("SELECT * FROM `user` WHERE userId = ?", [userId]).then(result => {
        if(!result.length) this.query("INSERT INTO `user`(userId) VALUES(?)", [userId]);
    });
}
exports.checkLevelRoles = (client, userId) => {
    if(isNaN(userId) || userId.length != 18) return;
    this.query("SELECT `level` FROM user WHERE userId = ?", [userId]).then(result => {
        if(result.length){
            const level = result[0].level;
            const member = client.guilds.cache.get(botGuild).members.cache.get(userId);
            if(level >= 5 && !hasRole(client, member, levelRoles.five)){
                addRole(client, member, levelRoles.five);
            } else if(hasRole(client, member, levelRoles.five)){
                removeRole(client, member, levelRoles.five);
            }
            if(level >= 10 && !hasRole(client, member, levelRoles.ten)){
                addRole(client, member, levelRoles.ten);
            } else if(hasRole(client, member, levelRoles.ten)){
                removeRole(client, member, levelRoles.ten);
            }
            if(level >= 25 && !hasRole(client, member, levelRoles.twentyfive)){
                addRole(client, member, levelRoles.twentyfive);
            } else if(hasRole(client, member, levelRoles.twentyfive)){
                removeRole(client, member, levelRoles.twentyfive);
            }
            if(level >= 50 && !hasRole(client, member, levelRoles.fifty)){
                addRole(client, member, levelRoles.fifty);
            } else if(hasRole(client, member, levelRoles.fifty)){
                removeRole(client, member, levelRoles.fifty);
            }
            if(level >= 100 && !isVip(client, member)){
                addRole(client, member, levelRoles.hundered);
            } else if(isVip(client, member)){
                removeRole(client, member, levelRoles.hundered);
            }
        }
    });
}
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
    this.query("UPDATE user SET `level` = ? WHERE userId = ?", [level, userId]).then(()=>{
        this.checkLevelRoles(client, userId);
    });
}
exports.setExp = (client, userId, amount) => new Promise(async resolve => {
    amount = parseInt(amount);
    if(isNaN(userId) || userId.length != 18 || isNaN(amount) || amount < 0) return;
    this.query("UPDATE `user` SET `exp` = ? WHERE userId = ?", [amount, userId]).then(()=>{
        this.checkLevel(client, userId);
        resolve();
    });
});
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
exports.setLevel = (client, userId, amount) => new Promise(async resolve => {
    amount = parseInt(amount);
    if(isNaN(userId) || userId.length != 18 || isNaN(amount) || amount < 0) return;
    if(amount == 0) return this.setExp(client, userId, amount);
    const neededExp = baseexp * (amount) + addexp * (amount - 1);
    await this.setExp(client, userId, neededExp);
    resolve();
});
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
exports.isBlacklisted = async (userId) => {
    if(isNaN(userId) || userId.length != 18) return false;
    const result = await this.query("SELECT * FROM blacklisted WHERE userId = ?", [userId]);
    return result.length ? true : false;
}
exports.makeOrderId = async () => {
    let id = "";
    for(let i = 0; i < idLength; i++){
        id += characters.charAt(randomInt(0, characters.length));   
    }
    const result = await this.query("SELECT orderId FROM `order` WHERE orderId = ?",[id]);
    return result.length ? this.makeOrderId() : id;
}
exports.deleteOrders = async (client) => {
    const results = await this.query("SELECT orderId, userId, guildId FROM `order` WHERE status NOT IN('delivered', 'deleted')");
    const deletedGuilds = [];
    for(let result of results){
        const guild = client.guilds.cache.get(result.guildId);
        if (!guild && !deletedGuilds.includes(result.guildId)){
            deletedGuilds.push(result.guildId);
            this.query("DELETE FROM `order` WHERE guildId = ?", [result.guildId]);
        } else if (guild) {
            const member = guild.members.cache.get(result.userId);
            if(!member){
                this.query("DELETE FROM `order` WHERE userId = ?", [result.userId]);
            }
        }
    }
}
exports.makeApplicationId = async () => {
    let id = "";
    for(let i = 0; i < idLength; i++){
        id += characters.charAt(randomInt(0, characters.length));
    }
    const result = await this.query("SELECT applicationId FROM `application` WHERE applicationId = ?", [id]);
    return result.length ? this.makeApplicationId() : id;
}