/**
 * Created by liuchaorun on 2017/4/2.
 */
const router = require('koa-router')();
const model = require('../db/model');
const md5 = require('md5');
const nodemailer = require('nodemailer');
let users = model.users;
let transporter = nodemailer.createTransport({
    service: '126',
    auth: {
        user: 'pobooks@126.com',
        pass: 'pobooks126'
    }
});

router.post('/action=signUpVerify', async (ctx, next) => {
    ctx.custom_Email = ctx.request.body.email;
    let n = Math.floor(Math.random() * 9000 + 1000);
    ctx.session.verify = n.toString();
    let user = await users.count({where: {email: ctx.custom_Email}});
    if (user === 1) ctx.response.status = 406;
    else {
        let mailOptions = {
            from: '"pobooks" <pobooks@126.com>', // sender address
            to: ctx.custom_Email, // list of receivers
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
        users.create({
            email: ctx.custom_email,
            password: ctx.custom_password
        });
        ctx.response.status = 200;
    }
    else ctx.response.status = 406;
    await next();
});
router.post('/action=login', async (ctx, next) => {
    ctx.custom_email = ctx.request.body.email;
    ctx.custom_password = ctx.request.body.password;
    if (ctx.cookie.get('user', {}) === undefined) {
        let user = await users.findOne({where: {email: ctx.custom_email}});
        if (user.password === ctx.custom_password) {
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
            ctx.session.user = ctx.custom_email;
            ctx.response.status = 200;
            let data={
                "name":"hahahahhaha",
                "age":"18"
            };
            ctx.api(data);
        }
        else ctx.response.status = 406;
    }
    else ctx.response.status = 200;
    await next();
});
router.post('/action=details', async (ctx, next) => {
    ctx.custom_user_id = ctx.request.body.user_id;
    ctx.custom_phoneNum = ctx.request.body.phone;
    ctx.Secret_question = ctx.request.body.question;
    ctx.Secret_answer = ctx.request.body.answer;
    users.create({
        user_id: ctx.custom_user_id.toString(),
        phone: ctx.custom_phoneNum.toString(),
        question: ctx.Secret_question.toString(),
        answer: ctx.Secret_answer.toString()
    }).then(p => {
        console.log(`creat` + JSON.stringify(p));
    }).catch(err => {
        console.log(`failed:` + err);
    });
    await next();
});
router.get('/action=json',async (ctx,next)=>{
    let data={
        "name":"hahahahhaha",
        "age":"18"
    };
    ctx.api(data);
    console.log(ctx.response);
    await next();
});
module.exports = router;
