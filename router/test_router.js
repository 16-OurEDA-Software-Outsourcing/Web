/**
 * Created by postgres on 2017/5/14.
 */
const router = require('koa-router')();
const model = require('../db/model');
const md5 = require('md5');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');
let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 3000
    }
});
let user_auth = model.user_auths;
let user = model.user;
let book = model.books;
let bumapping = model.bumapping;
let communication = model.communication;
let chapter = model.chapters;
book.belongsToMany(user_auth,{through:bumapping});
user.belongsTo(user_auth);
user_auth.hasOne(user);
book.hasMany(chapter);
chapter.belongsTo(book);

async function createTest() {

    let a = await user_auth.create({
        email:"23456789",
        user_id:"gsudsad",
        password:34111243
    }).catch(function (err){
        console.log(err);
    });

    let user = await a.createUser({nickname:'visitor'}).catch(function (err){
        console.log(err);
    });

    await next();








    // let test = await book.create(
    //     {
    //
    //
    //         book_name:'number1',
    //         writer:'sdrsf',
    //         size: 3835,
    //         chapter_num: 1,
    //         intro: 'asdhyuagisrgia',
    //         type: '1',
    //         title_picture: 'asd234ff',
    //         price: 0.00
    //
    //     });
    //
    // let test1 = await test.createChapter({chapter: 1, size: 33, address: 'http://123.206.71.182:8000/11234.txt',});
    // let test2 = await test.createChapter({chapter: 2, size: 62, address: 'http://123.206.71.182:8000/2.txt',});
    // let test3 = await test.createChapter({chapter: 3, size: 25, address: 'http://123.206.71.182:8000/3.txt',});
    // let test4 = await testt.createChapter({chapter: 1, size: 29, address: 'http://123.206.71.182:8000/abc.txt',});
    // let test5 = await testt.createChapter({chapter: 2, size: 135, address: 'http://123.206.71.182:8000/abcde.txt',});
    // let test6 = await testt.createChapter({chapter: 3, size: 43, address: 'http://123.206.71.182:8000/abd.txt',});
}
createTest().catch(e => {
        console.log(e);
    }
);

