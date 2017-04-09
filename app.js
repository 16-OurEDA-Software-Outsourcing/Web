/**
 * Created by liuchaorun on 2017/4/2.
 */
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router/route');
const session = require("koa-session2");
const Store = require("./redis/store.js");
const res_api = require('koa.res.api');
const IO = require('koa-socket');
const app = new koa();
const io = new IO();
app.use(res_api());
app.use(bodyParser());
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
app.use(async ctx=>{
    console.log("1");
});
app.listen(3000);