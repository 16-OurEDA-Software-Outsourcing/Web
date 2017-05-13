const database = require("../database");
const Sequelize = require('sequelize');

module.exports = database.defineModel('communication', {

    id: {
        type:Sequelize.BIGINT,
        primaryKey: true
    },
    user_a:{
        type:Sequelize.STRING(100)

    },
    user_b:{
        type:Sequelize.STRING(100)
    },
    friended:Sequelize.INTEGER

});