const{default: Db}=require('mysql2-async');
const{baseexp,addexp}=require('./level.json');
const{host,user,password,database}=require('./database.json');
const db_config={host:host,user:user,password:password,database:database,skiptzfix:true};
let db;function handleError(){try{db=new Db(db_config);}catch(error){if(error.sqlMessage=="Unknown or incorrect time zone: 'UTC'"){setTimeout(handleError,100);}else{throw error;}}}handleError();
exports.query=async(query,options=[])=>{return db.query(query,options);}
exports.addUser=async(userId)=>{if(isNaN(userId)||userId.length!=18)return;const result=await this.query(`SELECT * FROM \`user\` WHERE userId = ?`,[userId]);if(result.length)return;this.query(`INSERT INTO \`user\`(userId) VALUES(?)`,[userId]);}
exports.addExp=(userId,amount)=>{
    if(isNaN(userId)||userId.length!=18||isNaN(amount))return;
    this.query(`UPDATE \`user\` SET exp = exp + ? WHERE userId = ?`,[amount,userId]);
    checkLevel(userId);
}
function checkLevel(userId){
    if(isNaN(userId)||userId.length!=18)return;
    const result=await this.query("SELECT exp, `level` FROM user WHERE userId = ?",[userId]);
    if(!result.length)return;
    const exp=result[0].exp;
    let level=result[0].level;
    while(true){
        let expNeeded=baseexp*(level+1)+addexp*level;
        let expNeededPrev=baseexp*level+addexp*(level-1);
        if(exp<expNeededPrev){
            level--;
        }else if(exp>=expNeeded){
            level++;
        }else{
            break;
        }
    }
    this.query("UPDATE user SET `level` = ? WHERE userId = ?",[level,userId]);
}
