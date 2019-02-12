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
  let { count } = req.query;
  ListModel.find({user_id:user_id}).populate({path: 'word_id', model: WordModel}).exec(function(err, docs) {
    console.log(docs);
    let wordList = docs.map((item) => {
      return item.word_id;
    });
    count = parseInt(count, 10)
    if (count >= wordList.length) {
      count = wordList.length;
    }
    resultArr = getRandomArrayElements(wordList, count);
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
