var mysql = require('./../utils/mysql');

var tool = {
    get: (text, cb) => {
        mysql.query(`select * from word where text='${text}'`, function(err, results){
            if (results && results.length > 0) {
                const item = results[0];
                results[0].baseInfo = JSON.parse(item.baseInfo);
                results[0].raw = JSON.parse(item.raw);
                if (item.extends) {
                    results[0].extends = item.extends.replace("#DYH#","'");
                }
            }
            cb && cb(err, results[0]);
        });
    },
    set: (word, cb) => {
        mysql.query(`insert into word (
            text,
            baseInfo
        ) values (
            '${word.text}',
            '${JSON.stringify(word.baseInfo).replace("'","#DYH#")}'
        )`, (err) => {
                if (err) {
                    cb && cb(err, null);
                    return;
                }
                tool.get(word.text, (err, results) => {
                    cb && cb(err, results);
                });
        });
    },
    update: (word, cb) => {
        mysql.query(`UPDATE word SET extends='${word.extends.replace("'","#DYH#")}' WHERE text='${word.text}'`, (err) => {
            if (err) {
                cb && cb(err, null);
                return;
            }
            tool.get(word.text, (err, results) => {
                cb && cb(err, results);
            });
        });
    }
};

module.exports = tool;