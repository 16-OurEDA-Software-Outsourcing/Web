const database = require("../database");
const Sequelize = require('sequelize');
module.exports = database.defineModel('books', {

    book_id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    book_name: {
        type:Sequelize.STRING(40)
    },
    writer:{
        type:Sequelize.STRING(20)
    },
    size:{
        type:Sequelize.DOUBLE
    },
    chapter_num:{
        type:Sequelize.INTEGER
    },
    intro:{
        type:Sequelize.STRING(200)
    },

    type:Sequelize.STRING(10),

    title_picture:{
        type:Sequelize.STRING(100)
    },
    price:Sequelize.DOUBLE


});
