/**
 * Created by liuchaorun on 2017/3/30.
 */
const database = require("../database");
module.exports=database.defineModel('users',{
    email:database.STRING(255),
    password:database.STRING(16)
});
