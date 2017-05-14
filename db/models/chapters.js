const database = require("../database");
const Sequelize = require('sequelize');
module.exports = database.defineModel('chapters', {


    chapter: {
        type:Sequelize.INTEGER
    },
    size:{
        type:Sequelize.DOUBLE
    },

    address:{
        type:Sequelize.STRING(400)
    }


});/**
 * Created by postgres on 2017/4/10.
 */
