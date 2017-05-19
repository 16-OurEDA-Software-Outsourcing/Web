const router = require('koa-router')();
const model = require('../db/model');
const md5 = require('md5');
const nodemailer = require('nodemailer');
const config = require('../db/config');
const Sequelize = require('sequelize');
const renderer = require('../admin/view');
const multer = require('koa-multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/home/ubuntu/file/');    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, req.name+'.txt');
    }
});
const upload = multer({ storage: storage });

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
router.post('/admin/upload',upload.single('file'),async(ctx,next)=>{
    console.log(ctx.req.file.size);
    console.log(ctx.req.body.name);
    book.create({
        book_name:ctx.req.body.name,
        writer:ctx.req.body.writer,
        size:ctx.req.file.size,
        chapter_num:parseInt(ctx.req.body.num),
        type:1,
        intro:ctx.req.body.name,
        price:parseInt(ctx.req.body.price),
        title_picture:'http:123.206.71.182:8000/'
    });
    let bookall = await book.findAll();
    let booka = new Array();
    for(let i=0;i<bookall.length;++i){
        booka[i]={};
        booka[i].name = bookall[i].book_name;
        booka[i].writer = bookall[i].writer;
        booka[i].num = bookall[i].chapter_num;
        booka[i].createdate = bookall[i].created_at;
        booka[i].update = bookall[i].updated_at;
        booka[i].price = bookall[i].price;
    }
    let data={booksall:booka};
    ctx.body = await renderer('books.ect',data);
    await next();
});
router.get('/admin',async(ctx,next)=>{
     ctx.body = await renderer('login.ect');
     await next();
});
router.post('/admin/index',async(ctx,next)=>{
    if(ctx.request.body.u==='admin'&&ctx.request.body.p==='pobooks5')
        ctx.body=await renderer('index.ect');
    else ctx.body='密码错误或该用户不存在！'
});
router.get('/admin/books',async(ctx,next)=>{
    let bookall = await book.findAll();
    let booka = new Array();
    for(let i=0;i<bookall.length;++i){
        booka[i]={};
        booka[i].name = bookall[i].book_name;
        booka[i].writer = bookall[i].writer;
        booka[i].num = bookall[i].chapter_num;
        booka[i].createdate = bookall[i].created_at;
        booka[i].update = bookall[i].updated_at;
        booka[i].price = bookall[i].price;
    }
    let data={booksall:booka};
    ctx.body = await renderer('books.ect',data);
    await next();
});
router.get('/admin/users',async(ctx,next)=>{
    let userall = await user_auth.findAll();
    let usera = new Array();
    for(let i=0;i<userall.length;++i){
        usera[i]={};
        usera[i].email=userall[i].email;
        usera[i].phonenumber=userall[i].phone;
        usera[i].createdate=userall[i].created_at;
        usera[i].update=userall[i].updated_at;
    }
    let data={userall:usera};
    ctx.body = await renderer('users.ect',data);
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

router.post('/action=getPersonHomePage',async (ctx,next) =>{

    let custom_get_homepage_by_email = ctx.request.body.user_auth_id;
    let getPersonHomePage = await user.findOne({
        where:{email:custom_get_homepage_by_email}
    });
    ctx.api(getPersonHomePage);
    await next();

});


router.post('/action=getPersonHomePage',async (ctx,next) =>{

    let custom_get_homepage_by_email = ctx.request.body.email;
    let getPersonHomePage = await user.findOne({
        where:{email:custom_get_homepage_by_email}
    });
    let getPersonCommunicationSituation = await communication.findOne({
        where:{}
    });
    ctx.api(getPersonHomePage);
    await next();

});

router.post('/action=addConcern',async (ctx,next) =>{

    let custom_user_a = ctx.request.body.user_a;
    let custom_target_user_b = ctx.request.body.user_b;
    let get_friendship = await communication.findAll({
        where: {
            $and: [
                {user_a: custom_user_a},
                {user_b: custom_target_user_b}
            ]
        }
    });
    if (get_friendship === null ){
      let createdOne = communication.create({
            user_a:custom_user_a,
            user_b:custom_target_user_b,
            friended:1
        });
        ctx.response.body = '关注成功';
    }
    else if (get_friendship.friended === 0) {
        let updateOne = communication.update({

            friended:1
        });
        ctx.response.body = '关注成功';
    }
    else if (get_friendship.friended === 1) {
        let updateOne = communication.update({

            friended: 0
        });
        ctx.response.body = '取消关注成功';
    }
    else {
        ctx.response.body = '操作失败';
    }

    await next();

});




module.exports = router;
