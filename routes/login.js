var express = require('express');
var router = express.Router();
var mongoModels = require('../utils/mongoUtil');
var jwt = require('jsonwebtoken');

const UserModel = mongoModels.user;

// 7天
const tokenValidTime = 60 * 60 * 24 * 7;

router.post('/', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.pwd;
  UserModel.find({username: username}, (err, docs) => {
    if (docs.length == 0) {
      UserModel({username, password}).save((err, doc) => {
        const data = {
          username: username,
          token: jwt.sign({
            username: username,
            user_id: doc._id,
          }, 'qwer1qaz', {
              expiresIn: tokenValidTime
            })
        }
        res.json({
          status:1,
          data,
          message:'注册成功！'
        });
      });
    } else {
      const doc = docs[0];
      const data = {
        username: username,
        token: jwt.sign({
          username: username,
          user_id: doc._id,
        }, 'qwer1qaz', {
            expiresIn: tokenValidTime
          })
      }
      if (password === doc.password) {
        res.json({
          status: 1,
          data,
          message: '登录成功',
        })
      } else {
        res.json({
          status: 0,
          message: '密码错误',
        })
      }
    }
  });
});

module.exports = router;
