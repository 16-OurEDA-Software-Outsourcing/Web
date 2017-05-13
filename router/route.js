const router = require('koa-router')();
const model = require('../db/model');
const md5 = require('md5');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');
const renderer = require('../admin/view');
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
let transporter = nodemailer.createTransport({
    service: '126',
    auth: {
        user: 'pobooks@126.com',
        pass: 'pobooks126'
    }
});
router.get('/admin',async(ctx,next)=>{
     ctx.body = await renderer('index.ect');
     await next();
});
router.post('/action=signUpVerify', async (ctx, next) => {
    ctx.custom_Email = ctx.request.body.email;
    let n = Math.floor(Math.random() * 9000 + 1000);
    ctx.session.verify = n.toString();
    let user = await user_auth.count({where: {email: ctx.custom_Email}});
    if (user === 1) ctx.response.status = 406;
    else {
        let mailOptions = {
            from: '"pobooks" <pobooks@126.com>', // sender address
            to: ctx.custom_Email,
            // list of receivers
            subject: '破万卷验证码', // Subject line
            text: '您的验证码为:' + ctx.session.verify, // plain text body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        ctx.response.status = 200;
    }
    await next();
});
router.post('/action=signup', async (ctx, next) => {
    ctx.custom_email = ctx.request.body.email;
    ctx.custom_password = ctx.request.body.password;
    ctx.custom_verify = ctx.request.body.verify;
    if (ctx.session.verify === ctx.custom_verify) {
        let a = await user_auth.create({
            email: ctx.custom_email,
            user_id: ctx.custom_email,
            password: ctx.custom_password
        }).catch(function (err){ 
            console.log(err);
        });
        let user = await a.createUser({nickname:'visitor'}).catch(function (err){
            console.log(err);
        });
        ctx.response.status = 200;
    }
    else ctx.response.status = 406;
    await next();
});
router.post('/action=login', async (ctx, next) => {
    ctx.custom_email = ctx.request.body.email;
    ctx.custom_password = ctx.request.body.password;
    let user_authA = await user_auth.findOne({where: {email: ctx.custom_email}});
    if (ctx.cookies.get('user',{}) === undefined) {
        if (user_authA.password === ctx.custom_password) {
            let md = md5(ctx.custom_email);
            ctx.cookies.set(
                'user',
                md,
                {
                    domain: '123.206.71.182',  // 写cookie所在的域名
                    path: '/',       // 写cookie所在的路径
                    maxAge: 60 * 60 * 24 * 1000 * 365, // cookie有效时长
                    httpOnly: true,  // 是否只用于http请求中获取
                    overwrite: true  // 是否允许重写
                }
            );
            ctx.session.email=ctx.custom_email;
            ctx.response.status = 200;
        }
        else ctx.response.status = 406;
    }
    else ctx.response.status = 200;
    if(ctx.response.status===200){
        let userData = await user.findOne({where:{user_auth_id:user_authA.id}});
        let data={};
        data.nickname=userData.nickname;
        data.avatar=userData.avatar;
        data.sex=userData.sex;
        data.fullintroduction=userData.fullintroduction;
        data.receive_address=userData.receive_address;
        data.favourite=userData.favourite;
        ctx.api(data);
    }
    await next();
});
router.post('/action=user=information',async (ctx,next)=>{
    let data = ctx.request.body;
    let user_authA = await user_auth.findOne({where: {email: ctx.request.body.email}});
    let userID = await user_authA.id;
    await user.update(data,{where:{user_auth_id:userID}}).catch(function (err){
        ctx.response.body = 'NO';
        console.log(err);
    });
     ctx.response.body = 'ok';
    await next();
});
router.post('/action=search', async (ctx, next) => {
    let custom_type=ctx.request.body.type;
    await console.log(custom_type);
    let booka = await book.findAll({
        where: {
            $or: [
                {type: custom_type},
                {
                    book_name: {
                        $like: `%${custom_type}%`
                    }
                }
            ]
        }
    })
        .catch(function (err){
        console.log(err);
    });
    ctx.api(booka);
    await next();
});

router.post('/action=readbook', async (ctx,next) => {
    let custom_book_id=ctx.request.body.book_id;

    let readbook = await chapter.findAll({
        where:{book_book_id:custom_book_id}
    });
    ctx.api(readbook);
    await next();
});



router.post('/action=newlist', async (ctx,next) => {

    let newlist = await book.findAll({
        order:['book_id','DESC']
    });
    ctx.api(newlist);
     await next();
});

router.post('/action=freelist', async (ctx,next) => {

    let freelist = await book.findAll({
        where:{price:0.00}
    });
    ctx.api(freelist);
    await next();
});
router.post('/action=createlist', async (ctx,next) => {

    let createlist = await book.findAll();
    ctx.api(createlist);
    await next();
});
router.post('/action=listenlist', async (ctx,next) => {

    let listenlist = await book.findAll({
        where:{type:'voice'}
    });
    ctx.api(listenlist);
    await next();
});




module.exports = router;
