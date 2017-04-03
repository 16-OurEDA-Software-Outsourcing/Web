/**
 * Created by liuchaorun on 2017/4/2.
 */
const router = require('koa-router')();
const model = require('../db/model');
const md5 = require('md5');
const nodemailer = require('nodemailer');
let users = model.users;
let transporter = nodemailer.createTransport({
    service:'126',
    auth: {
        user: 'pobooks@126.com',
        pass: 'pobooks126'
    }
});
router.post('/action=signUpVerify',async (ctx,next)=>{
    ctx.verify=ctx.request.body.verify;
    if(ctx.verify===ctx.custom_signUpVerify){
        users.create({
            email:ctx.custom_email.toString(),
            password:ctx.custom_password.toString()
        }).then(p=>{
            console.log(`creat`+JSON.stringify(p));
        }).catch(err=>{
            console.log(`failed:`+err);
            ctx.body=`注册失败`+`err`;
        });
    }
    else ctx.request.status=406
});
router.post('/action=signup',async (ctx,next)=>{
    ctx.custom_email = ctx.request.body.email;
    ctx.custom_password = ctx.request.body.password;
    let user = await users.count({where:{email:ctx.custom_email.toString()}});
    if(user===1) ctx.request.status=406;
    else {
        ctx.custom_signUpVerify=md5(ctx.custom_email);
        let mailOptions = {
            from: '"pobooks" <pobooks@126.com>', // sender address
            to: ctx.custom_email.toString(), // list of receivers
            subject: '破万卷验证码', // Subject line
            text: '您的验证码为'+ctx.custom_signUpVerify, // plain text body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
    await next();
});
router.post('/action=login',async (ctx,next)=>{
    ctx.custom_email = ctx.request.body.email;
    ctx.custom_password = ctx.request.body.password;
    let user = await users.findOne({where:{email:ctx.custom_username.toString()}});
    if(user.password===ctx.custom_password){
        let md = md5(ctx.custom_email.toString());
        ctx.cookies.set(
            'user',
            md,
            {
                domain: '123.206.71.182',  // 写cookie所在的域名
                path: '/',       // 写cookie所在的路径
                maxAge: 60*60*24*1000*365, // cookie有效时长
                httpOnly: true,  // 是否只用于http请求中获取
                overwrite: true  // 是否允许重写
            }
        );
        ctx.session.user=ctx.custom_email;
    }
    else ctx.request.status=406;
    await next();
});
module.exports=router;