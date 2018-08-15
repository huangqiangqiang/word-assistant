var express = require('express');
var router = express.Router();
var mysql = require('./../utils/mysql');
var jwt = require('jsonwebtoken');

// 7天
const tokenValidTime = 60 * 60 * 24 * 7;

router.post('/', function(req, res, next) {
    const phone = req.body.phone;
    const pwd = req.body.pwd;
    mysql.query(`select * from user where phone='${phone}'`, function(err, results){
        // console.log(results);
        if (results.length === 0) {
            mysql.query(`insert into user (phone, password) values ('${phone}','${pwd}')`, function(err){
                if (err) {
                    console.log(err);
                    res.json({status:0});
                    return;
                }
                // 获取最近插入数据的id
                mysql.query(`SELECT LAST_INSERT_ID()`, function(err, results){
                    const user_id = results[0]['LAST_INSERT_ID()'];
                    const data = {
                        phone: phone,
                        token: jwt.sign({
                                    phone: phone,
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
                    phone: results[0].phone,
                    token: jwt.sign({
                                phone: phone,
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
