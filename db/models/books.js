const database = require("../database");
const Sequelize = require('sequelize');
module.exports = database.defineModel('books', {

    book_id: {
        type: Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    book_name: {
        type:Sequelize.STRING(200)
    },
    writer:{
        type:Sequelize.STRING(60)
    },
    size:{
        type:Sequelize.DOUBLE
    },
    chapter_num:{
        type:Sequelize.INTEGER
    },
    intro:{
        type:Sequelize.STRING(2000)
    },

    type:Sequelize.STRING(100),

    title_picture:{
        type:Sequelize.STRING(200)
    },
    price:Sequelize.DOUBLE


});
