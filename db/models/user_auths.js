const database = require("../database");
const Sequelize = require('sequelize');
module.exports = database.defineModel('user_auths', {

    id:{
        type:Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },

    email:{
        type: Sequelize.STRING(100)

    },
    temperary_code:Sequelize.INTEGER,
    password:{
        type:Sequelize.STRING(20)
    },
    user_id: Sequelize.STRING(20),
    phone: Sequelize.BIGINT,
     question: Sequelize.STRING(100),
     answer: Sequelize.STRING(100)

});
