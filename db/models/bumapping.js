const database = require("../database");
const Sequelize = require('sequelize');

module.exports = database.defineModel('bumapping', {

    chapters: {
        type:Sequelize.INTEGER
    },
    bumapped:Sequelize.INTEGER

});
//
//
// const models = require('../model');
