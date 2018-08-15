var express = require('express');
var router = express.Router();
var mysql = require('./../utils/mysql');

router.get('/', function(req, res, next) {
    console.log(req.query);
    mysql.query(`select * from history, word where history.word_id = word.id and user_id=${req.user.user_id} order by history.id desc LIMIT ${req.query.page * 50},50`, function(err, results){
        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            results[i].baseInfo = JSON.parse(item.baseInfo.replace("#DYH#","'"));
        }
        res.json({status:1,data:results});
    })
});

router.delete('/', function(req, res, next) {
    if (!req.query.word_id) {
        res.json({status:0,message:'word_id is nessisary!'});
    }
    mysql.query(`delete from history where user_id=${req.user.user_id} and word_id=${req.query.word_id}`, function(err, results){
        res.json({status:1});
    })
});

module.exports = router;
