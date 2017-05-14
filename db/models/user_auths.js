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
    password:{
        type:Sequelize.STRING(20)
    },
    user_id: Sequelize.STRING(100),
    phone: Sequelize.BIGINT,
     question: Sequelize.STRING(1000),
     answer: Sequelize.STRING(1000)

});
