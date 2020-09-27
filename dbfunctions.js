const{default: Db}=require('mysql2-async');
const{host,user,password,database}=require('./database.json');
const db_config={host:host,user:user,password:password,database:database,skiptzfix:true};
let db;function handleError(){try{db=new Db(db_config);}catch(error){if(error.sqlMessage=="Unknown or incorrect time zone: 'UTC'"){setTimeout(handleError,100);}else{throw error;}}}handleError();
exports.query=async(query,options=[])=>{return db.query(query,options);}
exports.addUser=async(userId)=>{if(isNaN(userId)||userId.length!=18)return;const result=await this.query(`SELECT * FROM \`user\` WHERE userId = ?`,[userId]);if(result.length)return;this.query(`INSERT INTO \`user\`(userId) VALUES(?)`,[userId]);}
