const{default: Db}=require('mysql2-async');
const{host,user,password,database}=require('./database.json');
const db_config={host:host,user:user,password:password,database:database,skiptzfix:true};
let db=new Db(db_config);setInterval(function(){db=new Db(db_config);}, 60000);
exports.query=async(query,options=[])=>{return db.query(query,options);}
exports.addUser=async(userId)=>{if(isNaN(userId)||userId.length!=18)return;const result=await this.query(`SELECT * FROM \`user\` WHERE userId = ?`,[userId]);if(result.length)return;this.query(`INSERT INTO \`user\`(userId) VALUES(?)`,[userId]);}
