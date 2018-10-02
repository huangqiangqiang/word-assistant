const mongoModels = require('./mongoUtil');

const WordModel = mongoModels.word;

const tool = {
  get: (text, cb) => {
    WordModel.find({text}, (err, docs)=>{
      cb && cb(err, docs[0]);
    });
  },
  set: (word, cb) => {
    WordModel.find({text: word.text}, (err, docs) => {
      if (docs.length === 0) {
        WordModel(word).save((err, doc) => {
          if (err) {
            cb && cb(err, null);
            return;
          }
          tool.get(word.text, (err, results) => {
            cb && cb(err, results);
          });
        });
      } else {
        cb && cb(null, docs[0]);
      }
    });
  },
  update: (word, cb) => {
    WordModel.update({_id: word._id}, word, (err) => {
      WordModel.findById(word._id, (err, docs) => {
        cb && cb(err, docs);
      });
    });
  }
};

module.exports = tool;