const database = require("../database");
const Sequelize = require('sequelize');
module.exports = database.defineModel('users', {

    nickname:{
        type:Sequelize.STRING(20)
    },
    briefintroduction: Sequelize.STRING(30),
    avatar: Sequelize.STRING(200),
    sex: Sequelize.BOOLEAN,
    age: Sequelize.INTEGER,
    occupation: Sequelize.STRING(20),
    school: Sequelize.STRING(50),
    country:Sequelize.STRING(20),
    province:Sequelize.STRING(20),
    city:Sequelize.STRING(20),
    motherlanguage:Sequelize.STRING(20),
    fullintroduction:Sequelize.TEXT,
    receive_address:Sequelize.STRING(100),
    favourite:Sequelize.STRING(50)

});
