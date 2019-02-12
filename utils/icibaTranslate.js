var axios = require('axios');

module.exports = {
  translate: function (text, cb) {
    const timestamp = new Date().getTime();
    const url = `http://www.iciba.com/index.php?a=getWordMean&c=search&word=${text}&_=${timestamp}&callback=jsonp4`;
    axios.get(url)
      .then((res) => {
        const data = eval(res.data);
        if (data.errno === 404) {
          cb && cb({ status: 0, message: data.errmsg }, null);
          return;
        }
        let result = {};
        let baseInfo = data.baesInfo;
        if (baseInfo && baseInfo.translate_type === 1) {
          let symbol = {};
          // symbols 字段可能没有
          if (baseInfo.symbols && baseInfo.symbols.length !== 0) {
            symbol = baseInfo.symbols[0];
          }
          const parts = symbol.parts;
          result = {
            text: text,
            baseInfo: {
              src: text,
              dst: parts[0].means[0],
              dst_info: parts,
              voice: {
                am: symbol.ph_am,
                am_mp3: symbol.ph_am_mp3,
              }
            },
          };
        } else {
          // translate_type === 2
          result = {
            baseInfo: {
              src: text,
              dst: baseInfo.translate_result,
            },
          };
        }
        cb && cb(null, result);
      })
      .catch((e) => {
        console.log(e);
        // cb && cb(e, null);
      });
  }
}

/**
 * 
 * @param {此方法是url中定义的，最好和官方的保持一致} data 
 */
function jsonp4(data) {
  return data;
}

// field: baseInfo
// {
//     "text": "sleep",
//     "translate": {
//         "src": "sleep",
//         "dst": "睡觉",
//         "dst_info": [ 
//             { part: 'vi.& link-v.', means: [ '睡，睡觉' ] },
//             { part: 'vi.', means: [ '睡，睡觉', '睡眠状态' ] },
//             { part: 'vt.', means: [ '为…提供床位', '提供住宿', '以睡觉打发日子' ] },
//             { part: 'n.', means: [ '睡眠' ] } 
//         ],
//         "symbols": {
//             "am": 'slip',
//             "am_mp3": 'http://res.iciba.com/resource/amp3/1/0/c9/fa/c9fab33e9458412c527c3fe8a13ee37d.mp3'
//         }
//     }
// }


/**
 * 
{ translate_result: '我有',
  translate_type: 2,
  translate_lang: 'en-EU',
  ciba_translate_result: '',
  ciba_translate_msg: '以上结果来自机器翻译。',
  praise_open_close: 1,
  translate_msg: '以上结果来自机器翻译。',
  word_name: 'i have' 
}
 */