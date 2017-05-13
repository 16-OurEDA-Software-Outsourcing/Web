const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/route');
const session = require("koa-session2");
const Store = require("./redis/store.js");
const res_api = require('koa.res.api');
const app = new koa();
app.use(async (ctx,next)=>{
    await next();
    if(/^\/admin(\/[a-zA-Z0-9]{1,999}){0,20}$/.test(ctx.url)===true){
        ctx.type = 'text/html; charset=utf-8';
        ctx.set('Content-type', 'text/html');
    }
});
app.use(bodyParser());
app.use(res_api());
app.use(session({
    store: new Store()
}));
app.use(async(ctx,next)=>{
    if(ctx.session.view===undefined) ctx.session.view=0;
    else ctx.session.view++;
    console.log(ctx.session.user,ctx.session.view);
    await next();
});
app
    .use(router.routes())
    .use(router.allowedMethods());
app.listen(3000);