let ect = require('ect');
let renderer = ect({
    root:__dirname,
    ext:'.ect'
});
module.exports=renderer.render;