const PixelPizza = require("pixel-pizza");
const fs = require('fs');
const mysql = require("mysql2");
const {addRole, removeRole, hasRole, randomInt, error} = PixelPizza;
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
const checkRole = (number, goal, member, role) => {
    if(number >= goal && !hasRole(member, role)){
        addRole(member, role);
    } else if (number < goal && hasRole(member, role)){
        removeRole(member, role);
    }
}
exports.checkLevelRoles = (client, userId) => {
    if(isNaN(userId) || userId.length != 18) return;
    this.query("SELECT `level` FROM user WHERE userId = ?", [userId]).then(result => {
        if(result.length){
            const level = result[0].level;
            const member = client.guilds.cache.get(botGuild).members.cache.get(userId);
            checkRole(level, 5, member, levelRoles.five);
            checkRole(level, 10, member, levelRoles.ten);
            checkRole(level, 25, member, levelRoles.twentyfive);
            checkRole(level, 50, member, levelRoles.fifty);
            checkRole(level, 100, member, levelRoles.hundered);
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
exports.checkProChef = async member => {
    const workers = await this.query("SELECT * FROM worker WHERE workerId = ?", [member.user.id]);
    if(!workers.length) return;
    if(workers[0].cooks >= proAmount && !hasRole(member, proCook)){
        addRole(member, proCook);
    } else if(workers[0].cooks < proAmount && hasRole(member, proCook)){
        removeRole(member, proCook);
    }
}
exports.checkProDeliverer = async member => {
    const workers = await this.query("SELECT * FROM worker WHERE workerId = ?", [member.user.id]);
    if(!workers.length) return;
    if(workers[0].deliveries >= proAmount && !hasRole(member, proDeliverer)){
        addRole(member, proDeliverer);
    } else if(workers[0].deliveries < proAmount && hasRole(member, proDeliverer)){
        removeRole(member, proDeliverer);
    }
}
exports.makeId = async (table) => {
    const characters = /* "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz */"0123456789"/* -_" */;
    let id = "";
    for(let i = 0; i < idLength; i++){
        id += characters.charAt(randomInt(0, characters.length));
    }
    const result = await this.query(`SELECT \`${table}Id\` FROM \`${table}\` WHERE \`${table}Id\` = ?`,[id]);
    return result.length ? this.makeId(table) : id;
}