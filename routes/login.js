var express = require('express');
var router = express.Router();
var mysql = require('./../utils/mysql');
var jwt = require('jsonwebtoken');

// 7天
const tokenValidTime = 60 * 60 * 24 * 7;

router.post('/', function(req, res, next) {
    const username = req.body.username;
    const pwd = req.body.pwd;
    mysql.query(`select * from user where username='${username}'`, function(err, results){
        // console.log(results);
        if (results.length === 0) {
            mysql.query(`insert into user (username, password) values ('${username}','${pwd}')`, function(err){
                if (err) {
                    console.log(err);
                    res.json({status:0});
                    return;
                }
                // 获取最近插入数据的id
                mysql.query(`SELECT LAST_INSERT_ID()`, function(err, results){
                    const user_id = results[0]['LAST_INSERT_ID()'];
                    const data = {
                        username: username,
                        token: jwt.sign({
                                    username: username,
                                    user_id: user_id,
                                }, 'qwer1qaz', {
                                    expiresIn: tokenValidTime
                                })
                    }
                    res.json({status:1,data:data});
                })
            })
        } else {
            if (results[0].password === pwd) {
                const data = {
                    username: results[0].username,
                    token: jwt.sign({
                                username: username,
                                user_id: results[0].id
                            }, 'qwer1qaz', {
                                expiresIn: tokenValidTime
                            })
                }
                res.json({status:1,data:data});
            } else {
                res.json({status:0, message:'密码错误！'});
            }
        }
    })
});

module.exports = router;
