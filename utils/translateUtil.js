const baiduTranslate = require('./baiduTranslate');
const icibaTranslate = require('./icibaTranslate');
const wordsUtil = require('./wordsUtil');

module.exports = {
  translate: function (text, cb) {
    // 使用百度翻译
    // baiduTranslate.translate(text, cb);

    // 使用iciba翻译
    icibaTranslate.translate(text, cb);
  }
}