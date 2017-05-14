const database = require("../database");
const Sequelize = require('sequelize');
module.exports = database.defineModel('users', {

    nickname:{
        type:Sequelize.STRING(40)
    },
    briefintroduction: Sequelize.STRING(200),
    avatar: Sequelize.STRING(200),
    sex: Sequelize.BOOLEAN,
    age: Sequelize.INTEGER,
    occupation: Sequelize.STRING(40),
    school: Sequelize.STRING(100),
    country:Sequelize.STRING(40),
    province:Sequelize.STRING(40),
    city:Sequelize.STRING(40),
    motherlanguage:Sequelize.STRING(40),
    fullintroduction:Sequelize.TEXT,
    receive_address:Sequelize.STRING(400),
    favourite:Sequelize.STRING(100)

});
