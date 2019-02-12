var express = require('express');
var router = express.Router();
var mongoModels = require('../utils/mongoUtil');

const ListModel = mongoModels.list;
const WordModel = mongoModels.word;

router.get('/', function (req, res, next) {
  ListModel.find().populate({path: 'word_id', model: WordModel}).sort({create_time: -1}).exec((err, docs) => {
    let wordList = docs.map((item) => {
      return item.word_id;
    });
    res.json({status:1, data: wordList});
  });
});

router.delete('/', function (req, res, next) {
  console.log(req.query);
  const { word_id } = req.query;
  const { user_id } = req.user;
  if (!word_id) {
    res.json({ status: 0, message: 'word_id is nessisary!' });
  }
  ListModel.remove({user_id: user_id, word_id: word_id}, (err, docs) => {
    res.json({ status: 1 });
  });
});

module.exports = router;
