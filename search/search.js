/**
 * Created by lcr on 17-5-12.
 */
const superagent = require('superagent');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
let url = 'http://book.easou.com/w/search.html?q=%E6%96%97%E7%A0%B4%E8%8B%8D%E7%A9%B9&sty=1&f=0';
// function get() {
//     superagent.get(url)
//         .end((err,res)=>{
//         console.log(res);
//     });
// }
// get();
console.log(iconv.encode('斗破苍穹','GBK').toString('binary'));
//console.log(iconv.decode('%B6%B7%C6%C6%B2%D4%F1%B7','GBK'));