var express = require('express');
var router = express.Router();
var translateUtil = require('../utils/translateUtil');
var wordsUtil = require('../utils/wordsUtil');
var mongoModels = require('../utils/mongoUtil');

const ListModel = mongoModels.list;

// 新增查询单词
module.exports = router.post('/', function (req, res, next) {
  checkParams(req.body, res);

  const user = req.user;
  const queryArr = req.body.q;

  let translateLength = 0;
  let resultTranslate = [];
  for (let i = 0; i < queryArr.length; i++) {
    const text = queryArr[i];
    if (text.length === 0) {
      translateLength += 1;
      continue;
    }
    wordsUtil.get(text, function (err, word) {
      if (word) {
        resultTranslate.push(word);
        translateLength += 1;
        if (translateLength === queryArr.length) {
          res.json({ status: 1, data: resultTranslate });
        }
      } else {
        translateUtil.translate(text, (err, data) => {
          if (err) {
            console.log(err);
            let resData = { status: 0, message: '翻译出错' };
            if (err.status === 0) {
              resData.message = err.message;
            }
            res.json(resData);
            return;
          }
          wordsUtil.set(data, (err, savedWord) => {
            saveHistory(user, savedWord);
            resultTranslate.push(savedWord);
            translateLength += 1;
            if (translateLength === queryArr.length) {
              res.json({ status: 1, data: resultTranslate });
            }
          });
        });
      }
    });
  }
});

// 更新单词
module.exports = router.put('/', function (req, res, next) {
  const { text, content } = req.body;
  wordsUtil.get(text, function (err, word) {
    word.extends = content;
    wordsUtil.update(word, function (err, word) {
      res.json({ status: 1, data: word });
    });
  });
});

function checkParams(params, res) {
  let errJson = {
    status: 0,
  };
  if (!params.q) {
    errJson.message = 'missing paramters q';
    res.json(errJson);
  }
  if (!params.source) {
    errJson.message = 'missing paramters source';
    res.json(errJson);
  }
  if (!params.target) {
    errJson.message = 'missing paramters target';
    res.json(errJson);
  }
}

function saveHistory(user, word) {
  const create_time = new Date().getTime();
  const query_times = 1;
  ListModel.find({user_id: user.user_id, word_id: word._id}, (err, docs) => {
    if (docs.length === 0) {
      ListModel({
        user_id: user.user_id,
        word_id: word._id,
        create_time: create_time,
        query_times: query_times,
      }).save((err, doc) => {
        if (err) {
          console.log('add list table failure.', err);
        }
      });
    }
  });
}
