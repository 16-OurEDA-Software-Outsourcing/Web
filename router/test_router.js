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

    let test1 = await book.create(
        {
            book_name:'斗破苍穹',
            writer:'天蚕土豆',
            size: 123123132,
            chapter_num: 711,
            intro: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！新书等级制度：斗者，斗师，大斗师，斗灵，斗王，斗皇，斗宗，斗尊，斗圣，斗帝。',
            type: '1',
            title_picture: 'http://123.206.71.182:8000/bookimage/斗破苍穹.jpg',
            price: 0.00
        });
    let test2 = await book.create(
        {
            book_name:'唐砖',
            writer:'孑与2',
            size: 123123132,
            chapter_num: 1500,
            intro: '梦回长安，鲜血浸染了玄武门，太极宫的深处只有数不尽的悲哀，民为水，君为舟，的朗朗之音犹在长安大地回绕，异族的铁蹄却再一次踏破了玉门关，此恨何及？',
            type: '1',
            title_picture: 'http://123.206.71.182:8000/bookimage/唐砖.jpg',
            price: 0.00
        });
    let test3 = await book.create(
        {
            book_name:'最牛古董商',
            writer:'老三家老三',
            size: 123123132,
            chapter_num: 600,
            intro: '要什么有什么，您说我是吹牛皮？得，您当我没说。你想要秦砖汉瓦，成，一卡车够不够？不够还有的是，不过这可是个力气活，得加钱。唐伯虎真迹有没有？笑话，买唐伯虎真迹送秋香胭脂一盒。',
            type: '1',
            title_picture: 'http://123.206.71.182:8000/bookimage/最牛古董商.jpg',
            price: 0.00
        });
    let test4 = await book.create(
        {
            book_name:'英雄联盟之从小兵开始',
            writer:'天蚕土豆',
            size: 123123132,
            chapter_num: 598,
            intro: '从一介小兵开始，一点点成长为真正的英雄——疾风的逃亡之路；艾瑞莉娅的觉醒传世；南部丛林的猎人传奇；影子教派的建立；比尔吉沃特的纷争；弗雷尔卓德的冰霜乱斗；诺克萨斯的血色精锐；天使国度的内乱；恕瑞玛帝国的再临；福光岛向暗影岛的沉沦......他在符文之地留下的无数传说，直到他正式加入英雄联盟，为了亲友抵抗着虚空的入侵。',
            type: '1',
            title_picture: 'http://123.206.71.182:8000/bookimage/英雄联盟之从小兵开始.jpg',
            price: 0.00
        });
    let test5 = await book.create(
        {
            book_name:'首富巨星',
            writer:'京门菜刀',
            size: 1231,
            chapter_num: 64,
            intro: '一觉醒来，张启阳发现自己正在《我是歌手》的踢馆赛现场。他居然成了这个位面的华国首富之子！他的前身，离经叛道，酷爱摇滚。',
            type: '1',
            title_picture: 'http://123.206.71.182:8000/bookimage/首富巨星.jpg',
            price: 0.00
        });
}
createTest().catch(e => {
        console.log(e);
    }
);

