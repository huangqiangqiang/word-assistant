var axios = require('axios');
var md5 = require('md5');

module.exports = {
    translate: function(text, cb) {
        const appid = '';
        const q = text;
        const salt = 'qwer1qaz';
        const secret = '';
        const qs = appid + q + salt + secret;
        const sign = md5(qs);
        const from = 'en';
        const to = 'zh';

        const url = `https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(q)}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`
        axios.get(url)
        .then((res)=>{
            cb && cb(res, null);
        })
        .catch((e)=>{
            cb && cb(null, e);
        });
    }
}