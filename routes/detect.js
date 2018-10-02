const express = require('express');
const router = express.Router();
var mongoModels = require('../utils/mongoUtil');

const ListModel = mongoModels.list;
const WordModel = mongoModels.word;

router.get('/', function (req, res, next) {
  /**
   * 先取出当前用户所有的id
   */
  const { user_id } = req.user;
  ListModel.find({user_id:user_id}).populate({path: 'word_id', model: WordModel, select: '_id text baseInfo'}).exec(function(err, docs) {
    let wordList = docs.map((item) => {
      return item.word_id;
    });
    let count = parseInt(req.query.count, 10)
    if (count >= results.length) {
      count = results.length;
    }
    resultArr = getRandomArrayElements(results, count);
    res.json({status:1, data: resultArr});
  });
});

/**
 * 从arr数组里随机取count个元素
 * @param {*} arr 
 * @param {*} count 
 */
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
