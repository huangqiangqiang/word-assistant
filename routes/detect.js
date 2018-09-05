var express = require('express');
var router = express.Router();
var mysql = require('./../utils/mysql');

router.get('/', function (req, res, next) {
  console.log(req.query);
  /**
   * 先取出当前用户所有的id
   */
  mysql.query(`select * from history, word where history.word_id = word.id and user_id=${req.user.user_id}`, function (err, results) {
    let count = parseInt(req.query.count, 10)
    if (count >= results.length) {
      count = results.length;
    }
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      results[i].baseInfo = JSON.parse(item.baseInfo.replace("#DYH#", "'"));
    }
    resultArr = getRandomArrayElements(results, count);
    res.json({ status: 1, data: resultArr });
  })
});

function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

module.exports = router;
